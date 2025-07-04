const fs = require('fs').promises;
const fetch = require('node-fetch'); // 如果你用 fetch API，記得 npm 安裝 node-fetch@2

// 以下示範三個 fetch 函式，請你換成自己抓資料的邏輯
async function fetchMLB() {
  // 範例資料，換成真實 API 或爬蟲結果
  return [
    {home:'Yankees', homeScore:5, awayScore:3, away:'Red Sox', status:'進行中'},
    {home:'Dodgers', homeScore:2, awayScore:2, away:'Giants', status:'結束'}
  ];
}

async function fetchNBA() {
  return [
    {home:'Lakers', homeScore:110, awayScore:105, away:'Warriors', status:'結束'},
    {home:'Nets', homeScore:95, awayScore:98, away:'Celtics', status:'進行中'}
  ];
}

async function fetchSoccer() {
  return [
    {home:'Real Madrid', homeScore:2, awayScore:1, away:'Barcelona', status:"45'上半場"},
    {home:'Man Utd', homeScore:0, awayScore:0, away:'Chelsea', status:'進行中'}
  ];
}

function formatGames(title, games) {
  if (!games.length) return `${title}\n無比賽資料\n---`;
  const lines = games.map(g => `${g.home} ${g.homeScore} - ${g.awayScore} ${g.away} ${g.status}`);
  return `${title}\n${lines.join('\n')}\n---`;
}

async function main() {
  try {
    const mlb = await fetchMLB();
    const nba = await fetchNBA();
    const soccer = await fetchSoccer();

    const content = [
      formatGames('---MLB---', mlb),
      formatGames('---NBA---', nba),
      formatGames('---Soccer---', soccer),
    ].join('\n');

    await fs.writeFile('score.txt', content, 'utf-8');
    console.log('score.txt 已更新');
  } catch (e) {
    console.error('抓取比分失敗:', e);
  }
}

main();
