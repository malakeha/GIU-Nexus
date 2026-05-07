
// jobRoutes.js  —  MALAK's file

const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  getJobs, createJob, getJob, updateJob, deleteJob,
  applyToJob, getApplicants,
} = require('../controllers/jobcontroller');

const {
  getRecommendedJobs, getMyJobs, getSavedJobs, toggleSaveJob,
} = require('../controllers/jobExtraController');

// ── Specific named routes (must come before /:id) ──────────────
router.get('/recommended', protect, authorize('jobSeeker'), getRecommendedJobs);
router.get('/my-jobs',     protect, authorize('recruiter'), getMyJobs);
router.get('/saved',       protect, authorize('jobSeeker'), getSavedJobs);

// ── Base collection ────────────────────────────────────────────
router.get('/',  getJobs);
router.post('/', protect, authorize('recruiter'), createJob);

// ── Single job ─────────────────────────────────────────────────
router.get('/:id',    getJob);
router.patch('/:id',  protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.post('/:id/save', protect, authorize('jobSeeker'), toggleSaveJob);

// ── Applications sub-routes ────────────────────────────────────
router.post('/:jobId/apply',      protect, authorize('jobSeeker'), applyToJob);
router.get('/:jobId/applicants',  protect, authorize('recruiter'), getApplicants);

module.exports = router;