const express = require('express');
const app = express();
const cors = require('cors');
const chrome = require("chrome-aws-lambda");

app.use(express.json());
app.use(cors());

async function getHotel(hotelid, checkin, checkout) {

  const options = {
    args:  [chrome.args],
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };

  try {
    const browser = await chrome.puppeteer.launch(options);

    const page = await browser.newPage();

    await page.goto(
      `https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=${rooms}&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`,
      {
        waitUntil: "networkidle2",
      }
    );
    //await page.waitForTimeout(2000);
    let html = await page.evaluate(() => {
      return JSON.parse(document.querySelector("body").innerText);
    });
    await browser.close();    
    console.log(html);
    return html;
  } catch (error) {
    console.log(error);
  }
}

  // try {
  //   await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`, {
  //     waitUntil: "networkidle2",
  //   });
  //   let body = await page.waitForSelector('body');
  //   let json = await body?.evaluate(el => el.textContent);
  //   data.push(json);
  //   return data;
  // } catch (error) {
  //   console.error('Error:', error);
  //   await browser.close();
  //   throw error;
  // }

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


