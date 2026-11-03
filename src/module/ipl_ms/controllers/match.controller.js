import * as matchService from "../services/match.service.js";
import ApiResponse from "../../../common/utils/api-response.js";

const createMatch = async (req, res) => {
  const match = await matchService.createMatch(req.body);
  ApiResponse.created(res, "Match created successfully", match);
};

const getAllMatches = async (req, res) => {
  const matches = await matchService.getAllMatches();
  ApiResponse.ok(res, "Matches fetched successfully", matches);
};

const getMatchSchedule = async (req, res) => {
  const matches = await matchService.getMatchSchedule();
  ApiResponse.ok(res, "Match schedule fetched successfully", matches);
};

const getMatchesByTeam = async (req, res) => {
  const matches = await matchService.getMatchesByTeam(req.params.teamId);
  ApiResponse.ok(res, "Team matches fetched successfully", matches);
};

const getMatchById = async (req, res) => {
  const match = await matchService.getMatchById(req.params.id);
  ApiResponse.ok(res, "Match fetched successfully", match);
};

const updateMatch = async (req, res) => {
  const match = await matchService.updateMatch(req.params.id, req.body);
  ApiResponse.ok(res, "Match updated successfully", match);
};

const saveMatchResult = async (req, res) => {
  const match = await matchService.saveMatchResult(req.params.id, req.body.stats);
  ApiResponse.ok(res, "Match result saved successfully", match);
};

const deleteMatch = async (req, res) => {
  await matchService.deleteMatch(req.params.id);
  ApiResponse.ok(res, "Match deleted successfully");
};

export {
  createMatch,
  getAllMatches,
  getMatchSchedule,
  getMatchesByTeam,
  getMatchById,
  updateMatch,
  saveMatchResult,
  deleteMatch,
};
