const {
    getMyApplications,
    updateApplicationStatus
  } = require("../controllers/applicationcontroller");
  
  router.get("/my", getMyApplications);
  router.patch("/:id/status", updateApplicationStatus);
  
  module.exports = router;