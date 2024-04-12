import express from 'express'
import { properties } from '../controllers/apiControllers.js'

const router = express.Router()

router.get('/properties', properties)

export default router

