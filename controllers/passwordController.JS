exports.forgotPassword = async (req, res) => {
    res.json({ success: true, message: "Reset email sent" });
  };
  
  exports.resetPassword = async (req, res) => {
    res.json({ success: true, message: "Password reset successful" });
  };