exports.getJobs = async (req, res) => res.json({ success: true });
exports.createJob = async (req, res) => res.status(201).json({ success: true });
exports.getJobById = async (req, res) => res.json({ success: true });
exports.updateJob = async (req, res) => res.json({ success: true });
exports.deleteJob = async (req, res) => res.json({ success: true });