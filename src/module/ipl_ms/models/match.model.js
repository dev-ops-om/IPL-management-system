import mongoose from "mongoose";

const playerPerformanceSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    runs: { type: Number, default: 0, min: 0 },
    wickets: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const matchSchema = new mongoose.Schema(
  {
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team 1 is required"],
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team 2 is required"],
    },
    date: {
      type: Date,
      required: [true, "Match date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed"],
      default: "scheduled",
    },
    stats: {
      team1Runs: { type: Number, default: 0, min: 0 },
      team1Wickets: { type: Number, default: 0, min: 0 },
      team2Runs: { type: Number, default: 0, min: 0 },
      team2Wickets: { type: Number, default: 0, min: 0 },
      winnerTeamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
      },
      playerPerformances: {
        type: [playerPerformanceSchema],
        default: [],
      },
    },
  },
  { timestamps: true },
);

matchSchema.index({ date: 1 });
matchSchema.index({ team1: 1, team2: 1, date: 1 });

export default mongoose.model("Match", matchSchema);
