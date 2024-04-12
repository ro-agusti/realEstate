import express from 'express'
import { body } from 'express-validator'
import { adminProperty, createProperty, saveProperty, addImage, storeImage, editProperty, saveChangesProperty, deleteProperty, changeState,  showProperty, sendMessage, showMessage} from '../controllers/propertyController.js'
import protectRoute from '../middlewares/protectRoute.js';
import upload from '../middlewares/uploadFile.js';
import identifyUser from '../middlewares/identifyUser.js'

const router = express.Router();

router.get('/my-properties',protectRoute, adminProperty)

router.get('/properties/create', protectRoute, createProperty)
router.post('/properties/create', 
    protectRoute,
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

router.get('/properties/add-image/:id', 
    protectRoute,
    addImage)
router.post('/properties/add-image/:id',
    protectRoute,
    upload.single('images'),
    storeImage
)

router.get('/properties/edit/:id',
    protectRoute,
    editProperty
)
router.post('/properties/edit/:id', 
    protectRoute,
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
    saveChangesProperty
)
router.post('/properties/delete/:id',
    protectRoute,
    deleteProperty
)

router.put('/properties/:id',
    protectRoute,
    changeState
)

//public area
router.get('/property/:id',
    identifyUser,
    showProperty
)

//message storage
router.post('/property/:id',
    identifyUser,
    body('message').isLength({min:20}).withMessage('The query cannot be empty or too short'),
    sendMessage
)

router.get('/messages/:id',
    protectRoute,
    showMessage
)

export default router