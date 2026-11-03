import ApiError from "../../../common/utils/api-error.js";
import Broadcaster from "../models/broadcaster.model.js";

const createBroadcaster = async ({ name }) => {
  return Broadcaster.create({ name });
};

const getAllBroadcasters = async () => {
  return Broadcaster.find();
};

const getBroadcasterById = async (id) => {
  const broadcaster = await Broadcaster.findById(id);
  if (!broadcaster) {
    throw ApiError.notFound("Broadcaster not found");
  }
  return broadcaster;
};

const updateBroadcaster = async (id, { name }) => {
  const broadcaster = await Broadcaster.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true },
  );

  if (!broadcaster) {
    throw ApiError.notFound("Broadcaster not found");
  }

  return broadcaster;
};

const deleteBroadcaster = async (id) => {
  const broadcaster = await Broadcaster.findByIdAndDelete(id);
  if (!broadcaster) {
    throw ApiError.notFound("Broadcaster not found");
  }
  return broadcaster;
};

export {
  createBroadcaster,
  getAllBroadcasters,
  getBroadcasterById,
  updateBroadcaster,
  deleteBroadcaster,
};
