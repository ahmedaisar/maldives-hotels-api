const express = require('express');
const app = express();
const cors = require('cors');
let chrome = require("chrome-aws-lambda");
let puppeteer = require("puppeteer-core");

// let chrome = {};
// let puppeteer;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   let chrome = require("chrome-aws-lambda");
//   let puppeteer = require("puppeteer-core");
// } 


app.use(express.json());
app.use(cors());

async function getHotel(hotelid, checkin, checkout) {

  let options = { headless: 'new' };
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      executablePath: await chrome.executablePath,
      headless: 'new',
    };
  }
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  let data = []

  try {
    await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`);
    await page.waitForTimeout(1000);
    let body = await page.waitForSelector('body');
    let json = await body?.evaluate(el => el.textContent);
    data.push(json);
    return data;
  } catch (error) {
    console.error('Error:', error);
    await browser.close();
    throw error;
  }
}

app.get("/api/maldives/hotel", async function (req, res) {
  const { hotelid, checkin, checkout } = req.query

  const data = await getHotel(hotelid, checkin, checkout);

  return res.json(data);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} `);
})

module.exports = app;


