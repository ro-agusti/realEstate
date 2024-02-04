import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateID } from  '../helpers/tokens.js'
//import { Result } from 'postcss'

const formLogin = (req,res) => {
    res.render('auth/login',{
      page: 'Log In'
    })
}

const formSignup = (req,res) => {
    res.render('auth/signup',{
      page : 'Sign Up'
    })
}

const register = async (req, res) => {
    //validation
    await check('name').notEmpty().withMessage('Name is compulsory').run(req);
    await check('email').isEmail().withMessage('Doesn`t look like an email').run(req);
    await check('password').isLength({ min:6 }).withMessage('Password must contain at least 6 characters').run(req);
    await check('repeat_password').equals(req.body.password).withMessage('Passwords are not the same').run(req);

    let result = validationResult(req)

    //check result is empty
    if(!result.isEmpty()){
      //error
      return res.render('auth/signup',{
        page : 'Sign Up',
        errors: result.array(),
        user: {
          name: req.body.name,
          email: req.body.email
        }
      })
    }
    //extraer datos
    const { name, email, password } = req.body;
       // check user is not duplicated
    const userExists = await User.findOne( { where : { email } })
 
    if(userExists){
        return res.render('auth/signup',{
           page : 'Sign Up',
           errors: [{msg:'user is already registered'}],
           user: {
             name: req.body.name,
             email: req.body.email
           }
         })
       }
    //create user
    await User.create({
      name, 
      email,
      password,
      //validacion del usuario via mail
      token:generateID()
    });

    //mostrar mensaje de confirmacion

}

const formForfottenPassword = (req,res) => {
    res.render('auth/forgotten-password',{
      page : 'Regain your access to RealEstate'
    })
}

export {
    formLogin,
    formSignup,
    register,
    formForfottenPassword
}