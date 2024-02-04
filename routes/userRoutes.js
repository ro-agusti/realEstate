import express from 'express';
import { formLogin, formSignup, register, formForfottenPassword } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/login', formLogin);

router.get('/signup', formSignup);
router.post('/signup', register);

router.get('/forgotten-password', formForfottenPassword);

//router.route('/')
  //  .get(function(req,res){
      //  res.send('hello world in express')
    //})
    //.post(function(req,res){
      //  res.json({msg: 'Respuesta de tipo POST'})
    //})

export default router;