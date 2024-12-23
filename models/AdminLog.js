const mongoose = require("mongoose");
const AdminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model("AdminLog", AdminLogSchema);
