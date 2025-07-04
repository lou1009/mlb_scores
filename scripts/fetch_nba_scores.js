const fs = require("fs");
const fetch = require("node-fetch");

(async () => {
  try {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard");
    const data = await res.json();

    const games = data.events.map(event => {
      const teams = event.competitions[0].competitors;
      return `${teams[0].team.displayName} ${teams[0].score} - ${teams[1].score} ${teams[1].team.displayName}`;
    });

    fs.writeFileSync("nba_scores.txt", games.join("\n"));
    console.log("NBA scores updated.");
  } catch (error) {
    console.error("Error fetching NBA scores:", error);
  }
})();
