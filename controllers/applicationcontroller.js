const Application = require('../models/applicationModel;');

const JobPost = require('../models/JobPost');

// @desc    Get my applications

// @route   GET /api/v1/applications/my

// @access  Job Seeker

exports.getMyApplications = async (req, res, next) => {

  try {

    const applications = await Application.find({ user: req.user._id })

      .populate('job', 'title company type status');

    res.status(200).json({ success: true, applications });

  } catch (err) {

    next(err);

  }

};

// @desc    Update application status

// @route   PATCH /api/v1/applications/:id/status

// @access  Recruiter (job owner)

exports.updateApplicationStatus = async (req, res, next) => {

  try {

    const { status } = req.body;

    if (!['pending', 'shortlisted', 'rejected'].includes(status)) {

      return res.status(400).json({ success: false, message: 'Invalid status' });

    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {

      return res.status(404).json({ success: false, message: 'Application not found' });

    }

    if (application.job.createdBy.toString() !== req.user._id.toString()) {

      return res.status(403).json({

        success: false,

        message: 'Not authorised to update this application',

      });

    }

    application.status = status;

    await application.save();

    res.status(200).json({ success: true, application });

  } catch (err) {

    next(err);

  }

};

// @desc    Get all applications (admin)

// @route   GET /api/v1/applications

// @access  Admin

exports.getAllApplications = async (req, res, next) => {

  try {

    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const total = await Application.countDocuments();

    const applications = await Application.find()

      .populate('user', 'name email')

      .populate('job', 'title company')

      .skip(skip)

      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), applications });

  } catch (err) {

    next(err);

  }

};