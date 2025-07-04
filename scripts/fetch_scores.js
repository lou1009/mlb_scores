const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchESPNScoreboard() {
  try {
    // 抓 ESPN MLB 分數頁 HTML
    const res = await fetch('https://www.espn.com/mlb/scoreboard');
    const html = await res.text();

    // 用 cheerio 載入
    const $ = cheerio.load(html);

    // 找到你要的區塊 (class: Card gameModules gameModules--mobile)
    const gameModules = $('.Card.gameModules.gameModules--mobile');

    // 將該區塊的 HTML 包在簡單的網頁模板裡
    const content = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ESPN MLB 指定比分區塊</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
        </style>
      </head>
      <body>
        ${gameModules.html() || '<p>找不到比賽資料</p>'}
      </body>
      </html>
    `;

    // 寫入 index.html
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('✔ 已寫入 index.html');
  } catch (error) {
    console.error('抓取 ESPN 失敗:', error);
  }
}

fetchESPNScoreboard();
