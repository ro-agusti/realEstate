import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const User =db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token:DataTypes.STRING,
    confirm:DataTypes.BOOLEAN
},{
    //encriptar passwords
    hooks: { 
            beforeCreate: async function(usuario){
                const salt = await bcrypt.genSalt(10)
                usuario.password = await bcrypt.hash( usuario.password, salt );
            }
    }
})

export default User;
