import * as teamService from "../services/team.service.js";
import * as teamSponsorService from "../services/team-sponser.service.js";
import * as teamBroadcasterService from "../services/team-braodcaster.service.js";
import * as playerService from "../services/player.service.js";
import ApiResponse from "../../../common/utils/api-response.js";

const createTeam = async (req, res) => {
  const team = await teamService.createTeam(req.body);
  ApiResponse.created(res, "Team created successfully", team);
};

const getAllTeams = async (req, res) => {
  const teams = await teamService.getAllTeams();
  ApiResponse.ok(res, "Teams fetched successfully", teams);
};

const getTeamById = async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);
  ApiResponse.ok(res, "Team fetched successfully", team);
};

const updateTeam = async (req, res) => {
  const team = await teamService.updateTeam(req.params.id, req.body);
  ApiResponse.ok(res, "Team updated successfully", team);
};

const deleteTeam = async (req, res) => {
  await teamService.deleteTeam(req.params.id);
  ApiResponse.ok(res, "Team deleted successfully");
};

const getTeamPlayers = async (req, res) => {
  const players = await playerService.getPlayersByTeam(req.params.id);
  ApiResponse.ok(res, "Team players fetched successfully", players);
};

const attachSponsor = async (req, res) => {
  const link = await teamSponsorService.attachSponsor({
    teamId: req.params.id,
    sponsorId: req.body.sponsorId,
  });
  ApiResponse.created(res, "Sponsor attached to team", link);
};

const getTeamSponsors = async (req, res) => {
  const sponsors = await teamSponsorService.getSponsorsByTeam(req.params.id);
  ApiResponse.ok(res, "Team sponsors fetched successfully", sponsors);
};

const detachSponsor = async (req, res) => {
  await teamSponsorService.detachSponsor({
    teamId: req.params.id,
    sponsorId: req.params.sponsorId,
  });
  ApiResponse.ok(res, "Sponsor detached from team");
};

const assignBroadcaster = async (req, res) => {
  const link = await teamBroadcasterService.assignBroadcaster({
    teamId: req.params.id,
    broadcasterId: req.body.broadcasterId,
  });
  ApiResponse.created(res, "Broadcaster assigned to team", link);
};

const getTeamBroadcasters = async (req, res) => {
  const broadcasters = await teamBroadcasterService.getBroadcastersByTeam(
    req.params.id,
  );
  ApiResponse.ok(res, "Team broadcasters fetched successfully", broadcasters);
};

const unassignBroadcaster = async (req, res) => {
  await teamBroadcasterService.unassignBroadcaster({
    teamId: req.params.id,
    broadcasterId: req.params.broadcasterId,
  });
  ApiResponse.ok(res, "Broadcaster unassigned from team");
};

export {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getTeamPlayers,
  attachSponsor,
  getTeamSponsors,
  detachSponsor,
  assignBroadcaster,
  getTeamBroadcasters,
  unassignBroadcaster,
};
