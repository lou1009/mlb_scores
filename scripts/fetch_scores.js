// scripts/fetch_scores.js
const fs = require('fs');
const https = require('https');

const url = 'https://www.espn.com/mlb/scoreboard';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('index.html', data);
    console.log('✔ 已寫入 index.html');
  });
}).on('error', err => {
  console.error('❌ 無法取得頁面:', err);
});
