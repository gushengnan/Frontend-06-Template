const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://localhost:8080/main.html');
    let imgs = await page.$$('a');
    console.log(imgs);

    await browser.close();
})();