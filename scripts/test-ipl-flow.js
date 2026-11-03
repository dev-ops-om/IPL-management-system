import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/module/auth/auth.model.js";

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 8080}`;
const TEST_EMAIL = "ipl.tester@example.com";
const TEST_PASSWORD = "Password123";

const request = async (method, path, { token, body } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status}: ${data.message}`);
  }
  return data;
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const ensureTestUser = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  let user = await User.findOne({ email: TEST_EMAIL });
  if (!user) {
    user = await User.create({
      name: "IPL Tester",
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: "admin",
      isVerified: true,
    });
  } else if (!user.isVerified) {
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
  }
  await mongoose.disconnect();
};

const run = async () => {
  await ensureTestUser();

  const health = await request("GET", "/health");
  assert(health.success, "Health check failed");

  const login = await request("POST", "/api/auth/login", {
    body: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });
  const token = login.data.accessToken;
  assert(token, "Login did not return access token");

  const ownerA = await request("POST", "/api/owners", {
    token,
    body: { name: "Nita Ambani", company: "Reliance" },
  });
  const ownerB = await request("POST", "/api/owners", {
    token,
    body: { name: "Kalanithi Maran", company: "Sun Group" },
  });

  const teamA = await request("POST", "/api/teams", {
    token,
    body: { name: "Mumbai Indians", ownerId: ownerA.data._id },
  });
  const teamB = await request("POST", "/api/teams", {
    token,
    body: { name: "Sunrisers Hyderabad", ownerId: ownerB.data._id },
  });

  const playerA = await request("POST", "/api/players", {
    token,
    body: { name: "Rohit Sharma", role: "batsman", teamId: teamA.data._id },
  });
  const playerB = await request("POST", "/api/players", {
    token,
    body: { name: "Jasprit Bumrah", role: "bowler", teamId: teamA.data._id },
  });
  await request("POST", "/api/players", {
    token,
    body: { name: "Pat Cummins", role: "bowler", teamId: teamB.data._id },
  });

  const teamPlayers = await request(
    "GET",
    `/api/players/team/${teamA.data._id}`,
    { token },
  );
  assert(teamPlayers.data.length === 2, "getPlayersByTeam should return 2 MI players");

  const sponsor = await request("POST", "/api/sponsors", {
    token,
    body: { name: "Dream11" },
  });
  await request("POST", `/api/teams/${teamA.data._id}/sponsors`, {
    token,
    body: { sponsorId: sponsor.data._id },
  });

  const broadcaster = await request("POST", "/api/broadcasters", {
    token,
    body: { name: "JioCinema" },
  });
  await request("POST", `/api/teams/${teamA.data._id}/broadcasters`, {
    token,
    body: { broadcasterId: broadcaster.data._id },
  });

  const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const scheduledMatch = await request("POST", "/api/matches", {
    token,
    body: {
      team1: teamA.data._id,
      team2: teamB.data._id,
      date: futureDate,
      venue: "Wankhede Stadium",
    },
  });

  const playedMatch = await request("POST", "/api/matches", {
    token,
    body: {
      team1: teamA.data._id,
      team2: teamB.data._id,
      date: pastDate,
      venue: "Rajiv Gandhi Stadium",
    },
  });

  await request("PATCH", `/api/matches/${playedMatch.data._id}/result`, {
    token,
    body: {
      stats: {
        team1Runs: 180,
        team1Wickets: 4,
        team2Runs: 165,
        team2Wickets: 8,
        winnerTeamId: teamA.data._id,
        playerPerformances: [
          { playerId: playerA.data._id, runs: 82, wickets: 0 },
          { playerId: playerB.data._id, runs: 8, wickets: 3 },
        ],
      },
    },
  });

  const schedule = await request("GET", "/api/matches/schedule", { token });
  assert(
    schedule.data.some((match) => match._id === scheduledMatch.data._id),
    "Schedule should include the upcoming match",
  );

  const teamMatches = await request(
    "GET",
    `/api/matches/team/${teamA.data._id}`,
    { token },
  );
  assert(teamMatches.data.length >= 2, "Team should have at least 2 matches");

  const topPlayers = await request("GET", "/api/players/top", { token });
  assert(topPlayers.data[0].name === "Rohit Sharma", "Top player should be Rohit by runs");

  const topWickets = await request("GET", "/api/players/top-wickets", { token });
  assert(
    topWickets.data[0].name === "Jasprit Bumrah",
    "Top wicket taker should be Bumrah",
  );

  const updatedPlayer = await request("GET", `/api/players/${playerA.data._id}`, {
    token,
  });
  assert(updatedPlayer.data.matchesPlayed === 1, "Player matchesPlayed should become 1");
  assert(updatedPlayer.data.stats.runs === 82, "Player runs should be updated");

  console.log("IPL API flow passed.");
  console.log({
    ownerA: ownerA.data._id,
    teamA: teamA.data._id,
    playerA: playerA.data._id,
    scheduledMatch: scheduledMatch.data._id,
    playedMatch: playedMatch.data._id,
  });
};

run().catch((error) => {
  console.error("IPL API flow failed:", error.message);
  process.exit(1);
});
