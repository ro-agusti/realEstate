import express from 'express'
import { homePage, category, notFound, searchEngine } from '../controllers/appController.js'

const router = express.Router()

//homepage
router.get('/', homePage)

//categories
router.get('/category/:id', category)

//page 404
router.get('/404', notFound)

// search engine
router.post('/search', searchEngine)

export default router