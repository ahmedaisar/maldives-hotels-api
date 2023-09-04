import { VercelRequest, VercelResponse } from '@vercel/node'
import playwright from '../utils/playwright'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  let { hotelid, checkin, checkout  } = req.query
  const response: any = await playwright(hotelid, checkin, checkout)
  console.log(response);
  res.status(200).send(response)
}
