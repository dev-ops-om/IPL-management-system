import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    role: {
      type: String,
      required: [true, "Player role is required"],
      enum: {
        values: ["batsman", "bowler", "all-rounder", "wicket-keeper"],
        message:
          'Role must be: "batsman" , "bowler" , "all-rounder" , "wicket-keeper"',
      },
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    matchesPlayed: {
      type: Number,
      default: 0,
      min: 0,
    },
    stats: {
      runs: { type: Number, default: 0, min: 0 },
      wickets: { type: Number, default: 0, min: 0 },
      fours: { type: Number, default: 0, min: 0 },
      sixes: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Player", playerSchema);
