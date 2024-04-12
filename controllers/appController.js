import { Sequelize } from 'sequelize'
import { Price, Category, Property } from '../models/index.js'

const homePage = async (req,res) => {

    const [ categories, prices, houses, apartments ] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
        Property.findAll({
            limit:3,
            where: {
                categoryID:1
            },
            include: [
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Property.findAll({
            limit:3,
            where: {
                categoryID:2
            },
            include: [
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    //console.log(categories)

    res.render('home-page',{
       page: 'Homepage',
       categories,
       prices,
       houses,
       apartments,
       csrfToken: req.csrfToken()
    })

}

const category = async (req,res) => {
    const { id } = req.params

    //verify category exist
    const category = await Category.findByPk(id)
    if(!category) {
        return res.redirect('/404')
    }

    // get property of the category
    const properties = await Property.findAll({
        where: {
            categoryID : id
        },
        include: [
            { model : Price, as: 'price' }
        ]
    })

    res.render('category', {
        page: `${category.name}s on sale`,
        properties,
        csrfToken: req.csrfToken()
    })

}

const notFound = (req,res) => {
    res.render('404', {
        page: "Not found",
        csrfToken: req.csrfToken()
    })   
}

const searchEngine = async (req,res) => {
    const { term } = req.body

    //verify term is not empty
    if (!term.trim()) {
        return res.redirect('back')
    }

    // consult properties
    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like] : '%' + term + '%'
            }
        },
        include: [
            { model: Price, as: 'price' }
        ]
    })
    res.render('search', {
        page: 'Search result',
        properties,
        csrfToken: req.csrfToken()
    })
}

export {
    homePage,
    category,
    notFound,
    searchEngine
}