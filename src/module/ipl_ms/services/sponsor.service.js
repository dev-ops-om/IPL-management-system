import ApiError from "../../../common/utils/api-error.js";
import Sponsor from "../models/sponser.model.js";

const createSponsor = async ({ name }) => {
  return Sponsor.create({ name });
};

const getAllSponsors = async () => {
  return Sponsor.find();
};

const getSponsorById = async (id) => {
  const sponsor = await Sponsor.findById(id);
  if (!sponsor) {
    throw ApiError.notFound("Sponsor not found");
  }
  return sponsor;
};

const updateSponsor = async (id, { name }) => {
  const sponsor = await Sponsor.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true },
  );

  if (!sponsor) {
    throw ApiError.notFound("Sponsor not found");
  }

  return sponsor;
};

const deleteSponsor = async (id) => {
  const sponsor = await Sponsor.findByIdAndDelete(id);
  if (!sponsor) {
    throw ApiError.notFound("Sponsor not found");
  }
  return sponsor;
};

export {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  updateSponsor,
  deleteSponsor,
};
