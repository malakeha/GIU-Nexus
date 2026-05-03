exports.getUsers = async (req, res) => {
  res.json({ success: true, message: "All users" });
};

exports.getUserById = async (req, res) => {
  res.json({ success: true, id: req.params.id });
};

exports.updateUserStatus = async (req, res) => {
  res.json({ success: true, message: "Status updated" });
};

exports.deleteUser = async (req, res) => {
  res.json({ success: true, message: "User deleted" });
};