import * as playwright from 'playwright-aws-lambda'

type Params = {
  checkin: string
  checkout: string
  hotelid: string
}


export default (hotelid, checkin, checkout) => {
  return new Promise(async (resolve, reject) => {
    console.log(hotelid)
    const browser = await playwright.launchChromium({ headless: false })
    const context = await browser.newContext({ screen: { width: 4096, height: 4096 } })
    const page = await context.newPage()

    // await page.goto(`https://hotelscan.com/`)
    await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`)


    let body = await page.waitForSelector('body');

    let res = await body?.evaluate(el => el.textContent);
    
    // let html = await page.evaluate(() => {
    // let body = document.querySelector("body").innerText;
    //   //let pre = document.querySelector("pre").innerHTML;
    //   return JSON.parse(body);
    // });

    await browser.close()

    resolve(res)
  })
}
