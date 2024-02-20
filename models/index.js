import Property from './Porperty.js'
import Price from './Price.js'
import Category from './Category.js'
import User from './User.js'

//Price.hasOne(Property)
Property.belongsTo(Price, {foreignKey: 'priceID'})
Property.belongsTo(Category, {foreignKey: 'categoryID'})
Property.belongsTo(User, {foreignKey: 'userID'})

export {
    Property,
    Price,
    Category,
    User
}