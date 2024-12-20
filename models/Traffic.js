const mongoose = require("mongoose");
const TrafficLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }, // Peut être null pour les visiteurs non connectés
  url: { type: String, required: true },
  country: String,
  city: String,
  region: String,
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model("TrafficLog", TrafficLogSchema);
