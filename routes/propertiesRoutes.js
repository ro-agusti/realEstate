import express from 'express'
import { body } from 'express-validator'
import { adminProperty, createProperty, saveProperty } from '../controllers/propertyController.js'

const router = express.Router();

router.get('/my-properties', adminProperty)
router.get('/properties/create', createProperty)
router.post('/properties/create', 
    body('title').notEmpty().withMessage('Publish property title is mandatory'),
    body('description')
        .notEmpty().withMessage('Publish property description is mandatory')
        .isLength({max:200}).withMessage('The description is too long'),
    body('category').isNumeric().withMessage('select a category'),
    body('price').isNumeric().withMessage('select a price range'),
    body('rooms').isNumeric().withMessage('select number of rooms'),
    body('parking').isNumeric().withMessage('select number of parking'),
    body('toilets').isNumeric().withMessage('select number of toilets'),
    body('lat').notEmpty().withMessage('locate the property on the map'),
    saveProperty
)

export default router