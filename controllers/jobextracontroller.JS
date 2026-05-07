// ============================================================
// jobExtraController.js  —  NADEEN's file
// GET  /api/v1/jobs/recommended   — Job Seeker
// GET  /api/v1/jobs/my-jobs       — Recruiter
// GET  /api/v1/jobs/saved         — Job Seeker
// POST /api/v1/jobs/:id/save      — Job Seeker (toggle)
// ============================================================
const JobPost = require('../models/JobPost');
const User    = require('../models/User');
const { getEmbeddings, cosineSimilarity } = require('./hfcontroller');

/**
 * GET /api/v1/jobs/recommended
 * Returns open jobs ranked by cosine similarity to the seeker's skills.
 * Falls back to unranked open jobs if HF call fails.
 */
exports.getRecommendedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No skills on your profile. Extract skills first.',
      });
    }

    const openJobs = await JobPost.find({ status: 'open' });

    if (openJobs.length === 0) {
      return res.status(200).json({ success: true, jobs: [] });
    }

    const studentText = user.skills.join(', ');
    const jobTexts    = openJobs.map(j => `${j.title} ${j.requirements.join(' ')}`);

    const embeddings = await getEmbeddings([studentText, ...jobTexts]);

    if (!embeddings) {
      // Graceful fallback — return jobs without scores
      return res.status(200).json({ success: true, jobs: openJobs });
    }

    const studentVec = embeddings[0];
    const ranked = openJobs
      .map((job, i) => ({
        ...job.toObject(),
        score: parseFloat(cosineSimilarity(studentVec, embeddings[i + 1]).toFixed(4)),
      }))
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({ success: true, jobs: ranked });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/jobs/my-jobs
 * Returns all jobs posted by the logged-in recruiter.
 */
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await JobPost.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/jobs/saved
 * Returns all saved jobs for the logged-in job seeker.
 */
exports.getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    return res.status(200).json({ success: true, jobs: user.savedJobs });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/jobs/:id/save
 * Toggles saved state. Only open jobs can be saved.
 */
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Cannot save a closed job' });
    }

    const user      = await User.findById(req.user._id);
    const alreadySaved = user.savedJobs.map(id => id.toString()).includes(job._id.toString());

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== job._id.toString());
      await user.save();
      return res.status(200).json({ success: true, message: 'Job removed from saved', saved: false });
    } else {
      user.savedJobs.push(job._id);
      await user.save();
      return res.status(200).json({ success: true, message: 'Job saved', saved: true });
    }
  } catch (err) {
    next(err);
  }
};