import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateID } from  '../helpers/tokens.js'
import { emailRegister, emailForgottenPassword } from '../helpers/emails.js'
//import { Result } from 'postcss'

const formLogin = (req,res) => {
    res.render('auth/login',{
      page: 'Log In',
      csrfToken: req.csrfToken()
    })
}

const authenticate = async(req,res) => {
  //validate
  await check('email').isEmail().withMessage('Doesn`t look like an email').run(req);
  await check('password').notEmpty().withMessage('Password in mandatory').run(req);

  let result = validationResult(req)

  //check result is empty
  if(!result.isEmpty()){
    return res.render('auth/login',{
      page : 'Log In',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })  
  }

  const { email, password } = req.body;

  //check if the user exist
  const user = await User.findOne({ where : { email }})
  if(!user) {
    return res.render('auth/login',{
      page : 'Log In',
      csrfToken: req.csrfToken(),
      errors: [{msg:'This user doesn`t exist'}]
    })  
  }

  //check that the user is confirmed
  if(!user.confirm){
    return res.render('auth/login',{
      page : 'Log In',
      csrfToken: req.csrfToken(),
      errors: [{msg:'Your account has not been confirmed'}]
    })  
  }

  //check password
  if(!user.checkPassword(password)){
    return res.render('auth/login',{
      page : 'Log In',
      csrfToken: req.csrfToken(),
      errors: [{msg:'Password incorrect'}]
    })  
  }

  //authenticate user
  

}

const formSignup = (req,res) => {
    console.log(req.csrfToken())
    res.render('auth/signup',{
      page : 'Sign Up',
      csrfToken: req.csrfToken()
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
        csrfToken: req.csrfToken(),
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
           csrfToken: req.csrfToken(),
           errors: [{msg:'user is already registered'}],
           user: {
             name: req.body.name,
             email: req.body.email
           }
         })
       }
    //create user
    const user = await User.create({
      name, 
      email,
      password,
      //validacion del usuario via mail
      token:generateID()
    });

    //envia mail de confirmacion
    emailRegister({
      name:user.name,
      email:user.email,
      token:user.token
    })

    //mostrar mensaje de confirmacion
    res.render('templates/message',{
        page:`${user.name}, account successfully created!!`,
        message:`We have sent you a confirmation email to ${user.email}, CLICK on the link below.`
    })

}

//function confirm your account
const confirm = async(req,res) => {
  const { token } = req.params;

  //verify if token is correct
const user = await User.findOne({ where : {token} })
if(!user) {
  return res.render('auth/confirm-account', {
    page:`Error confirming your account.`,
    message:`There was an error confirming your account, please try again.`,
    error: true
  })
}

  //verify account
  user.token=null;
  user.confirm=true;
  await user.save();
  res.render('auth/confirm-account', {
    page:'Account confirmed.',
    message:'Account was successfully confirmed.'
  })

} 

const formForfottenPassword = (req,res) => {
    res.render('auth/forgotten-password',{
      page : 'Regain your access to RealEstate',
      csrfToken: req.csrfToken(),
    })
}

const resetPassword = async(req, res) => {
 //validation
  await check('email').isEmail().withMessage('Doesn`t look like an email').run(req);

  let result = validationResult(req)

 //check result is empty
  if(!result.isEmpty()){
   //error
    return res.render('auth/forgotten-password',{
      page : 'Regain your access to RealEstate',
      csrfToken: req.csrfToken(),
      errors: result.array()
   })
  }    

 //search user
 const { email } =req.body;
 const user = await User.findOne({where : { email }})
 if(!user){
 return res.render('auth/forgotten-password',{
  page : 'Regain your access to RealEstate',
  csrfToken: req.csrfToken(),
  errors: [{msg: 'The email doesn`t belong to any user.'}]
  })
}

  //create token and send the email
  user.token = generateID();
  await user.save();
  // send email
  emailForgottenPassword({
    email: user.email,
    name: user.name,
    token: user.token
  })
  //render msg
  res.render('templates/message',{
    page:`${user.name}, reset your password`,
    message:`we have sent you an email to ${user.email} to reset your password, CLICK on the link below.`
  })

}

const verifyToken = async(req, res) => {
  
  const { token } = req. params;

  const user = await User.findOne({ where : {token} });

  if (!user) {
    return res.render('auth/confirm-account', {
      page:'Reset your password',
      message:'There was an error verifying your account, please try again.',
      error: true
    })
  }

  //show form for change password
  res.render('auth/reset-password',{
    page:'Reset your password',
    csrfToken: req.csrfToken(),
  })

  
}

const newPassword = async(req, res) => {
  //verify password
  await check('password').isLength({ min:6 }).withMessage('Password must contain at least 6 characters').run(req);

  let result = validationResult(req)
  if(!result.isEmpty()){
    return res.render('auth/reset-password',{
      page : 'Reset your password',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })
  }

  const { token } = req.params;
  const { password } = req.body;

  //identify who is making the change
  const user = await User.findOne({ where : {token} });

  //hash the new password
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash( password, salt );
  user.token = null;

  await user.save();

  res.render('auth/confirm-account', {
    page: 'Password Reset',
    message: 'Password was successfully saved'
  })

}

export {
    formLogin,
    authenticate,
    formSignup,
    register,
    confirm,
    formForfottenPassword,
    resetPassword,
    verifyToken,
    newPassword
}