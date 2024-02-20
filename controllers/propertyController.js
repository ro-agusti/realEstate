import { validationResult } from "express-validator"
import Price from "../models/Price.js"
import Category from "../models/Category.js"

const adminProperty = (req,res) => {
    res.render('properties/admin', {
        page: 'My properties',
        counter:true
    })
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
        counter:true,
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
            counter: true,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })  
    }
}

export {
    adminProperty,
    createProperty,
    saveProperty
}