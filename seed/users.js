import bcrypt from 'bcrypt'

const users = [
    {
        name: 'Lopez lopez',
        email: 'lopezlopez@lopez.com',
        confirm: 1,
        password: bcrypt.hashSync('123456',10)
    }
]

export default users