const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// 動態取得當天日期 (YYYY-MM-DD)
const today = new Date().toISOString().slice(0, 10);

// MLB API，sportId=1 表示 MLB
const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}`;

async function fetchScores() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    // 取得當天所有賽事
    const dates = data.dates;
    if (!dates || dates.length === 0) {
      console.log('今日無賽事');
      fs.writeFileSync(path.join(__dirname, '..', 'public', 'score.txt'), '今日無賽事');
      return;
    }

    const games = dates[0].games;
    if (!games || games.length === 0) {
      console.log('今日無賽事');
      fs.writeFileSync(path.join(__dirname, '..', 'public', 'score.txt'), '今日無賽事');
      return;
    }

    // 準備寫入的文字資料
    const lines = games.map(game => {
      const home = game.teams.home.team.name;
      const away = game.teams.away.team.name;
      const homeScore = game.teams.home.score;
      const awayScore = game.teams.away.score;
      const status = game.status.detailedState; // 比賽狀態（例如：Final、In Progress）

      return `${away} ${awayScore} @ ${home} ${homeScore} - ${status}`;
    });

    // 寫入 public/score.txt
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'score.txt'), lines.join('\n'));
    console.log('比分資料已更新');
  } catch (error) {
    console.error('抓取比分失敗:', error);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'score.txt'), '抓取比分失敗');
  }
}

fetchScores();
