const fs = require('fs');
const fetch = require('node-fetch');

// MLB 官方公開賽程API，抓當天比賽（可根據需求修改日期）
const API_URL = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=2025-07-04';

async function fetchMLBScores() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    const games = data.dates?.[0]?.games || [];

    const lines = games.map(game => {
      const home = game.teams.home.team.name;
      const away = game.teams.away.team.name;
      const homeScore = game.teams.home.score;
      const awayScore = game.teams.away.score;
      const status = game.status.detailedState;
      return `${away} ${awayScore} - ${home} ${homeScore} (${status})`;
    });

    const content = lines.join('\n') || '今日無比賽資料';

    fs.writeFileSync('./public/score.txt', content, 'utf8');

    console.log('比分資料已更新');
  } catch (err) {
    console.error('抓取或寫入失敗:', err);
  }
}

fetchMLBScores();
