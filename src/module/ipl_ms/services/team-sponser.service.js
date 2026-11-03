import ApiError from "../../../common/utils/api-error.js";
import Team from "../models/team.model.js";
import Sponsor from "../models/sponser.model.js";
import TeamSponsor from "../models/team-sponser.model.js";

const attachSponsor = async ({ teamId, sponsorId }) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw ApiError.notFound("Sponsor not found");
  }

  const existing = await TeamSponsor.findOne({ teamId, sponsorId });
  if (existing) {
    throw ApiError.conflict("Sponsor already attached to this team");
  }

  const teamSponsor = await TeamSponsor.create({ teamId, sponsorId });
  return teamSponsor.populate([
    { path: "teamId", select: "name" },
    { path: "sponsorId", select: "name" },
  ]);
};

const getSponsorsByTeam = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw ApiError.notFound("Team not found");
  }

  return TeamSponsor.find({ teamId }).populate("sponsorId", "name");
};

const detachSponsor = async ({ teamId, sponsorId }) => {
  const link = await TeamSponsor.findOneAndDelete({ teamId, sponsorId });
  if (!link) {
    throw ApiError.notFound("Sponsor is not attached to this team");
  }
  return link;
};

export { attachSponsor, getSponsorsByTeam, detachSponsor };
