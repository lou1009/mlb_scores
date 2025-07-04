const fs = require('fs');
const fetch = require('node-fetch');

(async () => {
  const date = new Date().toISOString().slice(0, 10);
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`;
  console.log(`取得比賽資料：${url}`);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.dates || data.dates.length === 0) {
      console.log('✅ API 無比賽資料');
      fs.writeFileSync('public/score.txt', '今日無比賽');
      return;
    }

    const games = data.dates[0].games;
    console.log(`📊 今日共有 ${games.length} 場比賽`);

    let output = '';
    for (const game of games) {
      const away = game.teams.away.team.name;
      const awayScore = game.teams.away.score ?? '-';
      const home = game.teams.home.team.name;
      const homeScore = game.teams.home.score ?? '-';
      const status = game.status.detailedState;

      output += `${away} ${awayScore} @ ${home} ${homeScore} - ${status}\n`;
    }

    fs.writeFileSync('public/score.txt', output.trim());
    console.log('✅ score.txt 寫入成功！');
  } catch (err) {
    console.error('❌ 發生錯誤：', err);
    fs.writeFileSync('public/score.txt', '⚠️ 比賽資料讀取失敗');
  }
})();
