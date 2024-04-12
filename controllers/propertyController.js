import { unlink } from "node:fs/promises"
import { validationResult } from "express-validator"
import { Price, Category, Property, Message, User } from "../models/index.js"
import { isSeller, formatDate } from "../helpers/index.js"

const adminProperty = async(req,res) => {

    //read queryString
    const { page: actualPage } = req.query
    //console.log(actualPage)
    const regularExpression = /^[1-9]$/

    if (!regularExpression.test(actualPage)) {
        return res.redirect('my-properties?page=1')
    }

    try {
        
        const { id } = req.user

        //limits and offset for the pager
        const limit = 10
        const offset = ((actualPage * limit) - limit)



        const [properties, total] = await Promise.all([
            await Property.findAll({
                limit,
                offset,
                where: {
                 userID : id
                },
                include: [
                    { model: Category, as:'category' },
                    { model: Price, as:'price' },
                    { model: Message, as:'messages' }
                ]
            }),
            Property.count({
                where: {
                    userID : id
                }
            })
        ])
        //console.log(total)

        res.render('properties/admin', {
            page: 'My properties',
            properties,
            csrfToken: req.csrfToken(),
            pages: Math.ceil(total / limit),
            actualPage: Number(actualPage),
            total,
            offset,
            limit
        })

    } catch (error) {
        console.log(error)
    }

}

//form new property
const createProperty = async(req,res) => {
    //consult db category model and prices
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/create', {
        page: 'Create property',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    })
}

const saveProperty = async(req,res) => {

    //validation
    let result = validationResult(req)
    if(!result.isEmpty()) {
        //check model of price and category
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        res.render('properties/create',{
            page : 'New property',
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })  
    }

    //crear registro
    const { title, description, rooms, parking, toilets, street, lat, lng, images, price, category } = req.body;

    const { id : userID} = req.user

    try {
        const propertySaved = await Property.create({
            title,
            description,
            rooms,
            parking,
            toilets,
            street,
            lat,
            lng,
            priceID: price,
            categoryID: category,
            userID,
            images : ' '
        })
        const { id } = propertySaved;

        //----------!!! atencion (`properties/add-image/${id}` !!!------------------)
        
        res.redirect(`add-image/${id}`)

    } catch (error) {
        console.log(error);
    }
}

const addImage = async (req,res) => {

    const { id } = req.params;

    //validar que la propiedad exista
    const property = await Property.findByPk(id)
    if(!property) {
        return res.redirect('/my-properties')
    }

    //validar que la propiedad no este publicada
    if(property.published == 1) {
        return res.redirect('/my-properties')
    }

    //validar que la propiedad pertenece a quien visite la pagina
    if(req.user.id.toString() !== property.userID.toString()){
        return res.redirect('/my-properties')
    }

    res.render('properties/add-image', {
        page: `Add image to ${property.title}`,
        csrfToken: req.csrfToken(),
        property
    })
}

const storeImage = async (req, res, next) => {

    const { id } = req.params;

    //validar que la propiedad exista
    const property = await Property.findByPk(id)
    if(!property) {
        return res.redirect('/my-properties')
    }

    //validar que la propiedad no este publicada
    if(property.published == 1) {
        return res.redirect('/my-properties')
    }

    //validar que la propiedad pertenece a quien visite la pagina
    if(req.user.id.toString() !== property.userID.toString()){
        return res.redirect('/my-properties')
    }

    try {

        //console.log(req.file)

        //store image and publish
        property.images = req.file.filename
        property.published = 1

        await property.save()

        next()

    } catch (error) {
        console.log(error)
    }
}

const editProperty = async (req,res) => {

    const { id } = req.params

    //validate property exist
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }

    //validate that the visitor to the URL is the one who created the property
    if (property.userID.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }

    //consult db category model and prices
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    return res.render('properties/edit', {
        page: `Edit property: ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    })
}

const saveChangesProperty = async (req,res) => {

    //verify validation
    //validation
    let result = validationResult(req)
    if(!result.isEmpty()) {
        //check model of price and category
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ]) 

       return res.render('properties/edit', {
            page: 'Edit property',
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const { id } = req.params

    //validate property exist
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }

    //validate that the visitor to the URL is the one who created the property
    if (property.userID.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }

    // edit data en db
    try {

        const { title, description, rooms, parking, toilets, street, lat, lng, price: priceID, category: categoryID } = req.body;
        
        property.set({
            title, 
            description,
            rooms,
            parking,
            toilets,
            street,
            lat,
            lng,
            priceID,
            categoryID
        })

        await property.save()

        await res.redirect('/my-properties')
        
    } catch (error) {
        console.log(error)
    }

}

const deleteProperty = async (req,res) => {

    const { id } = req.params

    //validate property exist
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }

    //validate that the visitor to the URL is the one who created the property
    if (property.userID.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }

    //delete property image
    await unlink(`public/uploads/${property.images}`)

    console.log(`image deleted ${property.images}`)

    //delete property
    await property.destroy(
        res.redirect('/my-properties')
    )

}

// modify property status - publish property
const changeState = async (req,res) => {

    const { id } = req.params

    //validate property exist
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }

    //validate that the visitor to the URL is the one who created the property
    if (property.userID.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }

    //update db
    property.published = !property.published
    await property.save()
    res.json ({
        result: 'ok'
    })

}

//show property
const showProperty = async (req,res) => {

    const {id} = req.params

    //validate property exist
    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as:'category' },
            { model: Price, as:'price' }
        ]
    })

    if ( !property || !property.published ) {
        return res.redirect('/404')
    }

    res.render('properties/show', {
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userID)
    })

}

const sendMessage = async (req,res) => {

    const {id} = req.params

    //validate property exist
    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as:'category' },
            { model: Price, as:'price' }
        ]
    })

    if (!property) {
        return res.redirect('/404')
    }

    //show errors
    //validation
    let result = validationResult(req)
    if(!result.isEmpty()) {
        return res.render('properties/show', {
            property,
            page: property.title,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req.user?.id, property.userID),
            errors: result.array()
        })
    }

    const { message } = req.body
    const { id: propertyID } = req.params
    const { id: userID } = req.user

    // save message
    await Message.create({
        message,
        propertyID,
        userID
    })

    //res.redirect('/')
    
    res.render('properties/show', {
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userID),
        sent: true
    })

}


// read sent message
const showMessage = async (req, res) => {

    const { id } = req.params

    //validate property exist
    const property = await Property.findByPk(id, {
        include: [
            { model: Message, as:'messages',
                include: [
                    {model: User.scope('deletePassword'), as: 'user'}
                ]
            }
        ],
    })
    if (!property) {
        return res.redirect('/my-properties')
    }

    //validate that the visitor to the URL is the one who created the property
    if (property.userID.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }

    res.render('properties/messages',{
        page: 'Messages',
        messages: property.messages,
        formatDate
    })
}

export {
    adminProperty,
    createProperty,
    saveProperty,
    addImage,
    storeImage,
    editProperty,
    saveChangesProperty,
    deleteProperty,
    changeState,
    showProperty,
    sendMessage,
    showMessage
}