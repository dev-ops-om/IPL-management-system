import * as playerService from "../services/player.service.js";
import ApiResponse from "../../../common/utils/api-response.js";

const createPlayer = async (req, res) => {
  const player = await playerService.createPlayer(req.body);
  ApiResponse.created(res, "Player created successfully", player);
};

const getAllPlayers = async (req, res) => {
  const players = await playerService.getAllPlayers();
  ApiResponse.ok(res, "Players fetched successfully", players);
};

const getPlayerById = async (req, res) => {
  const player = await playerService.getPlayerById(req.params.id);
  ApiResponse.ok(res, "Player fetched successfully", player);
};

const getPlayersByTeam = async (req, res) => {
  const players = await playerService.getPlayersByTeam(req.params.teamId);
  ApiResponse.ok(res, "Team players fetched successfully", players);
};

const updatePlayer = async (req, res) => {
  const player = await playerService.updatePlayer(req.params.id, req.body);
  ApiResponse.ok(res, "Player updated successfully", player);
};

const deletePlayer = async (req, res) => {
  await playerService.deletePlayer(req.params.id);
  ApiResponse.ok(res, "Player deleted successfully");
};

const transferPlayer = async (req, res) => {
  const player = await playerService.transferPlayer(
    req.params.id,
    req.body.teamId,
  );
  ApiResponse.ok(res, "Player transferred successfully", player);
};

const updatePlayerRole = async (req, res) => {
  const player = await playerService.updatePlayerRole(
    req.params.id,
    req.body.role,
  );
  ApiResponse.ok(res, "Player role updated successfully", player);
};

const getTopPlayers = async (req, res) => {
  const players = await playerService.getTopPlayers(req.query.limit);
  ApiResponse.ok(res, "Top players fetched successfully", players);
};

const getTopPlayersByWickets = async (req, res) => {
  const players = await playerService.getTopPlayersByWickets(req.query.limit);
  ApiResponse.ok(res, "Top wicket takers fetched successfully", players);
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
