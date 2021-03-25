const puppeteer = require('puppeteer');
const path = require('path');

const USER_DATA_DIR = './.puppeteer_user_data';

(async () => {
    const browser = await puppeteer.launch({
        // executablePath: path.resolve('/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe'),
        userDataDir: USER_DATA_DIR,
        // args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    let a = await page.$('document');
    console.log(a);

    await browser.close();
})();