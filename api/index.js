const playwright = require("playwright")


module.exports = async (req, res) => {
  let { hotelid, checkin, checkout  } = req.query
  let data = [];
  const launchOptions = {
       headless: false,
     }
   const browser = await playwright["chromium"].launch(launchOptions)
   const context = await browser.newContext()
   const page = await context.newPage()
   await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`);
   await page.waitForTimeout(1000);
   let body = await page.waitForSelector('body');
   await page.waitForTimeout(1000);
   let json = await body?.evaluate(el => el.textContent);
   data.push(json);
   console.log(data)
   await browser.close()

  res.status(200).json(data)
}

