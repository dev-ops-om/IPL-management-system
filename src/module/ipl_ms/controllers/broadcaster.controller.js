import * as broadcasterService from "../services/broadcaster.service.js";
import ApiResponse from "../../../common/utils/api-response.js";

const createBroadcaster = async (req, res) => {
  const broadcaster = await broadcasterService.createBroadcaster(req.body);
  ApiResponse.created(res, "Broadcaster created successfully", broadcaster);
};

const getAllBroadcasters = async (req, res) => {
  const broadcasters = await broadcasterService.getAllBroadcasters();
  ApiResponse.ok(res, "Broadcasters fetched successfully", broadcasters);
};

const getBroadcasterById = async (req, res) => {
  const broadcaster = await broadcasterService.getBroadcasterById(req.params.id);
  ApiResponse.ok(res, "Broadcaster fetched successfully", broadcaster);
};

const updateBroadcaster = async (req, res) => {
  const broadcaster = await broadcasterService.updateBroadcaster(
    req.params.id,
    req.body,
  );
  ApiResponse.ok(res, "Broadcaster updated successfully", broadcaster);
};

const deleteBroadcaster = async (req, res) => {
  await broadcasterService.deleteBroadcaster(req.params.id);
  ApiResponse.ok(res, "Broadcaster deleted successfully");
};

export {
  createBroadcaster,
  getAllBroadcasters,
  getBroadcasterById,
  updateBroadcaster,
  deleteBroadcaster,
};
