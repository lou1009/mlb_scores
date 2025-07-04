const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.espn.com/mlb/scoreboard';

async function fetchScores() {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);

    let html = `
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8" />
      <title>MLB 今日比分</title>
      <style>
        body { font-family: sans-serif; margin: 2em; }
        .game { margin-bottom: 1em; border-bottom: 1px solid #ccc; padding-bottom: 1em; }
      </style>
    </head>
    <body>
    <h1>${new Date().toLocaleDateString()} MLB 今日比分</h1>
    `;

    $('.Scoreboard').each((i, el) => {
      const home = $(el).find('.ScoreCell__TeamName--home').text().trim();
      const away = $(el).find('.ScoreCell__TeamName--away').text().trim();
      const homeScore = $(el).find('.ScoreCell__Score--home').text().trim();
      const awayScore = $(el).find('.ScoreCell__Score--away').text().trim();
      const status = $(el).find('.ScoreboardStatus').text().trim();

      if (home && away) {
        html += `<div class="game">
          <strong>${away}</strong> ${awayScore} @ <strong>${home}</strong> ${homeScore}<br/>
          <em>${status}</em>
        </div>`;
      }
    });

    html += '</body></html>';
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('更新完成 index.html');
  } catch (err) {
    console.error('爬取失敗:', err.message);
  }
}

fetchScores();
