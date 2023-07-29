const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

app.get("/players/", async (request, response) => {
  const players = `SELECT * FROM cricket_team
   ORDER BY player_id`;
  const playerArray = await db.all(players);
  response.send(playerArray);
  console.log(`Returns a list of all players in the team
`);
});

app.post("/players/", async (request, response) => {
  try {
    const playerDetails = request.body;
    const { player_id, player_name, jersey_number, role } = playerDetails;
    const addPlayerQuery = `INSERT
  INTO cricket_team (player_id,
      player_name	,
      jersey_number	,
      role) VALUES (${player_id},${player_name},${jersey_number},${role});`;
    const dbResponse = await db.run(addPlayerQuery);
    const players_id = dbResponse.lastID;
    response.send(
      `Creates a new player in the team (database). ${players_id} is auto-incremented`
    );
  } catch (e) {
    console.log(e.message);
  }
});
module.exports = app;
