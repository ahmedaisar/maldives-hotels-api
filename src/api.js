const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors');
let chrome = require("chrome-aws-lambda");
let puppeteer = require("puppeteer-core");

const api = express();

const router = express.Router();
router.get("/hello", (req, res) => {
  res.json({
    hello: "hello!"
  });
});
router.get("/maldives/hotel", async function (req, res) {
    const { hotelid, checkin, checkout } = req.query
    let options = { executablePath: await chrome.executablePath,
    headless: 'new', };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(hotelid, checkin, checkout);
    let data = []
  
    try {
      await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`);
      await page.waitForTimeout(1000);
      let body = await page.waitForSelector('body');
      let json = await body?.evaluate(el => el.textContent);
      data.push(json);
      await browser.close();
    } catch (error) {
      console.error('Error:', error);
      await browser.close();
      throw error;
    }
  
    res.json(data);
  })

api.use(`/.netlify/functions/api`, router);

export const handler = serverless(api);