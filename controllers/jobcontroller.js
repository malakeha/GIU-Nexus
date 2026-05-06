// ============================================================
// jobController.js  —  MALAK's file
// GET    /api/v1/jobs            — Public (paginated/filtered)
// POST   /api/v1/jobs            — Recruiter (approved)
// GET    /api/v1/jobs/:id        — Public
// PATCH  /api/v1/jobs/:id        — Recruiter (owner)
// DELETE /api/v1/jobs/:id        — Recruiter (owner) / Admin
// POST   /api/v1/jobs/:jobId/apply   — Job Seeker
// GET    /api/v1/jobs/:jobId/applicants — Recruiter (owner)
// ============================================================
const JobPost     = require('../models/JobPost');
const Application = require('../models/Application');
const { classifyJob } = require('./hfController');

/**
 * GET /api/v1/jobs
 * Public — paginated + filterable by keyword, location, type, status.
 */
exports.getJobs = async (req, res, next) => {
  try {
    const { keyword, location, type, status = 'open', page = 1, limit = 10 } = req.query;
    const query = {};

    if (status)   query.status   = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type)     query.type     = type;
    if (keyword)  query.$or = [
      { title:       { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await JobPost.countDocuments(query);
    const jobs  = await JobPost.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, total, page: Number(page), jobs });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/jobs
 * Recruiter only (approved). AI auto-classifies the description.
 */
exports.createJob = async (req, res, next) => {
  try {
    if (req.user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Wait for admin approval before posting jobs.',
      });
    }

    const category = await classifyJob(req.body.description);

    const job = await JobPost.create({
      ...req.body,
      category,
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/jobs/:id
 * Public — single job with recruiter info populated.
 */
exports.getJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    return res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/jobs/:id
 * Recruiter (owner). Re-classifies if description changed.
 */
exports.updateJob = async (req, res, next) => {
  try {
    let job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to edit this job' });
    }

    if (req.body.description && req.body.description !== job.description) {
      req.body.category = await classifyJob(req.body.description);
    }

    job = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/jobs/:id
 * Recruiter (owner) or Admin.
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const isOwner = job.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this job' });
    }

    await job.deleteOne();
    return res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/jobs/:jobId/apply
 * Job Seeker only. Duplicate rejected by unique index.
 */
exports.applyToJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const application = await Application.create({
      user:        req.user._id,
      job:         job._id,
      coverLetter: req.body.coverLetter || '',
    });

    return res.status(201).json({ success: true, application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }
    next(err);
  }
};

/**
 * GET /api/v1/jobs/:jobId/applicants
 * Recruiter (owner) — full applicant details.
 */
exports.getApplicants = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to view applicants' });
    }

    const applications = await Application.find({ job: job._id })
      .populate('user', 'name email skills');

    return res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};