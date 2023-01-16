import Token from '../../../models/Token'
import connectDb from '../../../middleware/mongoose'
import cookie from 'cookie'
import { verify } from 'jsonwebtoken'

const handler = async (req, res) => {

  try {
    let cookies = cookie.parse(req.headers.cookie)
    let token = cookies.authToken
    let userID = verify(token, 'mytokensecret32')

    if(userID.role !== 'Admin') return res.send({error: "You are not Allowed to Access this Route"})
    
    let tokens = await Token.find()
    res.send({ tokens })

  } catch (error) {
    res.send({error: "You are not Allowed to Access this Route"})
  }
}

export default connectDb(handler)