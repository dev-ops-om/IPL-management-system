import ApiError from "../../../common/utils/api-error.js";
import Match from "../models/match.model.js";
import Player from "../models/player.model.js";
import Team from "../models/team.model.js";

const populateMatch = (query) =>
  query
    .populate("team1", "name")
    .populate("team2", "name")
    .populate("stats.winnerTeamId", "name")
    .populate("stats.playerPerformances.playerId", "name role stats matchesPlayed");

const ensureTeamsExist = async (team1, team2) => {
  if (String(team1) === String(team2)) {
    throw ApiError.badRequest("A match needs two different teams");
  }

  const [firstTeam, secondTeam] = await Promise.all([
    Team.findById(team1),
    Team.findById(team2),
  ]);

  if (!firstTeam) {
    throw ApiError.notFound("Team 1 not found");
  }
  if (!secondTeam) {
    throw ApiError.notFound("Team 2 not found");
  }
};

const applyPlayerStats = async (playerPerformances = []) => {
  for (const performance of playerPerformances) {
    const player = await Player.findById(performance.playerId);
    if (!player) {
      throw ApiError.notFound(`Player not found: ${performance.playerId}`);
    }

    player.matchesPlayed += 1;
    player.stats.runs += Number(performance.runs) || 0;
    player.stats.wickets += Number(performance.wickets) || 0;
    await player.save();
  }
};

const createMatch = async (payload) => {
  await ensureTeamsExist(payload.team1, payload.team2);

  if (payload.status === "completed") {
    await applyPlayerStats(payload.stats?.playerPerformances);
  }

  const match = await Match.create(payload);
  return populateMatch(Match.findById(match._id));
};

const getAllMatches = async () => {
  return populateMatch(Match.find().sort({ date: 1 }));
};

const getMatchById = async (id) => {
  const match = await populateMatch(Match.findById(id));
  if (!match) {
    throw ApiError.notFound("Match not found");
  }
  return match;
};

const getMatchesByTeam = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  return populateMatch(
    Match.find({
      $or: [{ team1: teamId }, { team2: teamId }],
    }).sort({ date: 1 }),
  );
};

const getMatchSchedule = async () => {
  return populateMatch(
    Match.find({
      status: "scheduled",
      date: { $gte: new Date() },
    }).sort({ date: 1 }),
  );
};

const updateMatch = async (id, payload) => {
  if (payload.team1 || payload.team2) {
    const existing = await Match.findById(id);
    if (!existing) {
      throw ApiError.notFound("Match not found");
    }
    await ensureTeamsExist(
      payload.team1 || existing.team1,
      payload.team2 || existing.team2,
    );
  }

  const match = await Match.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!match) {
    throw ApiError.notFound("Match not found");
  }

  return populateMatch(Match.findById(match._id));
};

const saveMatchResult = async (id, stats) => {
  const match = await Match.findById(id);
  if (!match) {
    throw ApiError.notFound("Match not found");
  }

  if (match.status === "completed") {
    throw ApiError.conflict("Result already saved for this match");
  }

  await applyPlayerStats(stats?.playerPerformances);

  match.status = "completed";
  match.stats = stats;
  await match.save();

  return populateMatch(Match.findById(match._id));
};

const deleteMatch = async (id) => {
  const match = await Match.findByIdAndDelete(id);
  if (!match) {
    throw ApiError.notFound("Match not found");
  }
  return match;
};

export {
  createMatch,
  getAllMatches,
  getMatchById,
  getMatchesByTeam,
  getMatchSchedule,
  updateMatch,
  saveMatchResult,
  deleteMatch,
};
