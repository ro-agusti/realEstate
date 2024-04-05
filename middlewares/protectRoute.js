import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const protectRoute = async(req,res,next) => {
    //verify token exist
    console.log(req.cookies._token)

    const {_token} = req.cookies;
    if(!_token){
        return res.redirect('/auth/login')
    }
    //validate token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        
        const user = await User.scope('deletePassword').findByPk(decoded.id)

        //save user in req
        if(user){
            req.user = user
        }else{
            return res.redirect('/auth/login')
        }
        return next();

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default protectRoute