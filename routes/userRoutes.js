import express from 'express';
import { formLogin, authenticate, formSignup, register, confirm, formForfottenPassword, resetPassword, verifyToken, newPassword } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/login', formLogin);
router.post('/login', authenticate);

router.get('/signup', formSignup);
router.post('/signup', register);

router.get('/confirm/:token', confirm);

router.get('/forgotten-password', formForfottenPassword);
router.post('/forgotten-password', resetPassword);

//save new password
router.get('/forgotten-password/:token', verifyToken);
router.post('/forgotten-password/:token', newPassword);


export default router;