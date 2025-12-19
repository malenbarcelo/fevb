const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const usersQueries = require('../dbQueries/users/usersQueries')

const loginFormValidations = {
    login: [
        body('userName')
            .notEmpty().withMessage('Debe ingresar un usuario').bail()
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToLogin = await usersQueries.get({filters:{user_name: userName}})
                if (userToLogin.length == 0) {
                throw new Error('Usuario inválido')
                }
                return true
            }),
        body('password')
            .notEmpty().withMessage('Debe ingresar una contraseña').bail()
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToLogin = await usersQueries.get({filters:{user_name: userName}})
                if(userToLogin.length > 0){
                    if (!bcrypt.compareSync(req.body.password, userToLogin[0].password)) {
                        throw new Error('Contraseña inválida')
                    }
                }
                return true
            })
    ],
}

module.exports = loginFormValidations