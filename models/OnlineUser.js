const mongoose = require("mongoose");
const OnlineUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }, // Peut être null pour les visiteurs non connectés
  country: { type: String },
  region: { type: String },
  city: { type: String },
  lastActive: { type: Date, default: Date.now },
});
module.exports = mongoose.model("OnlineUser", OnlineUserSchema);
