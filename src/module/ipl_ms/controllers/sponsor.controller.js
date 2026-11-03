import * as sponsorService from "../services/sponsor.service.js";
import ApiResponse from "../../../common/utils/api-response.js";

const createSponsor = async (req, res) => {
  const sponsor = await sponsorService.createSponsor(req.body);
  ApiResponse.created(res, "Sponsor created successfully", sponsor);
};

const getAllSponsors = async (req, res) => {
  const sponsors = await sponsorService.getAllSponsors();
  ApiResponse.ok(res, "Sponsors fetched successfully", sponsors);
};

const getSponsorById = async (req, res) => {
  const sponsor = await sponsorService.getSponsorById(req.params.id);
  ApiResponse.ok(res, "Sponsor fetched successfully", sponsor);
};

const updateSponsor = async (req, res) => {
  const sponsor = await sponsorService.updateSponsor(req.params.id, req.body);
  ApiResponse.ok(res, "Sponsor updated successfully", sponsor);
};

const deleteSponsor = async (req, res) => {
  await sponsorService.deleteSponsor(req.params.id);
  ApiResponse.ok(res, "Sponsor deleted successfully");
};

export {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  updateSponsor,
  deleteSponsor,
};
