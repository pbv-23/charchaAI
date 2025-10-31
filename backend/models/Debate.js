import mongoose from "mongoose";

const DebateSchema = new mongoose.Schema({
  email: String,
  topic: String,
  messages: Array,
  humanStance: String,
  aiStance: String,
  humanScore: Number,
  aiScore: Number,
  winner: String,
  reason: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Debate", DebateSchema);
