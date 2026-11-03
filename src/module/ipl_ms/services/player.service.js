import ApiError from "../../../common/utils/api-error.js";
import Team from "../models/team.model.js";
import Player from "../models/player.model.js";

const createPlayer = async ({ name, role, teamId, matchesPlayed, stats }) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  const player = await Player.create({
    name,
    role,
    teamId,
    matchesPlayed,
    stats,
  });

  return player.populate("teamId", "name");
};

const getAllPlayers = async () => {
  return Player.find().populate("teamId", "name");
};

const getPlayerById = async (id) => {
  const player = await Player.findById(id).populate("teamId", "name");
  if (!player) {
    throw ApiError.notFound("Player not found");
  }
  return player;
};

const getPlayersByTeam = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  return Player.find({ teamId }).populate("teamId", "name");
};

const updatePlayer = async (id, payload) => {
  if (payload.teamId) {
    const team = await Team.findById(payload.teamId);
    if (!team) {
      throw ApiError.notFound("Team not found");
    }
  }

  const player = await Player.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("teamId", "name");

  if (!player) {
    throw ApiError.notFound("Player not found");
  }

  return player;
};

const deletePlayer = async (id) => {
  const player = await Player.findByIdAndDelete(id);
  if (!player) {
    throw ApiError.notFound("Player not found");
  }
  return player;
};

const transferPlayer = async (playerId, newTeamId) => {
  const team = await Team.findById(newTeamId);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  const player = await Player.findByIdAndUpdate(
    playerId,
    { teamId: newTeamId },
    { new: true, runValidators: true },
  ).populate("teamId", "name");

  if (!player) {
    throw ApiError.notFound("Player not found");
  }

  return player;
};

const updatePlayerRole = async (playerId, role) => {
  const player = await Player.findByIdAndUpdate(
    playerId,
    { role },
    { new: true, runValidators: true },
  ).populate("teamId", "name");

  if (!player) {
    throw ApiError.notFound("Player not found");
  }

  return player;
};

const getTopPlayers = async (limit = 5) => {
  return Player.find()
    .sort({ "stats.runs": -1, matchesPlayed: -1 })
    .limit(Number(limit) || 5)
    .populate("teamId", "name");
};

const getTopPlayersByWickets = async (limit = 5) => {
  return Player.find()
    .sort({ "stats.wickets": -1, matchesPlayed: -1 })
    .limit(Number(limit) || 5)
    .populate("teamId", "name");
};

export {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  getPlayersByTeam,
  updatePlayer,
  deletePlayer,
  transferPlayer,
  updatePlayerRole,
  getTopPlayers,
  getTopPlayersByWickets,
};
