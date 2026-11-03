import ApiError from "../../../common/utils/api-error.js";
import Owner from "../models/owner.model.js";
import Team from "../models/team.model.js";
import Player from "../models/player.model.js";

const createTeam = async ({ name, ownerId }) => {
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    throw ApiError.notFound("Owner not found");
  }

  const team = await Team.create({ name, ownerId });
  return team.populate("ownerId", "name company");
};

const getAllTeams = async () => {
  return Team.find().populate("ownerId", "name company");
};

const getTeamById = async (id) => {
  const team = await Team.findById(id).populate("ownerId", "name company");
  if (!team) {
    throw ApiError.notFound("Team not found");
  }
  return team;
};

const updateTeam = async (id, { name, ownerId }) => {
  if (ownerId) {
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      throw ApiError.notFound("Owner not found");
    }
  }

  const team = await Team.findByIdAndUpdate(
    id,
    { name, ownerId },
    { new: true, runValidators: true },
  ).populate("ownerId", "name company");

  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  return team;
};

const deleteTeam = async (id) => {
  const playersCount = await Player.countDocuments({ teamId: id });
  if (playersCount > 0) {
    throw ApiError.conflict("Cannot delete team while players are assigned");
  }

  const team = await Team.findByIdAndDelete(id);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }
  return team;
};

export { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam };
