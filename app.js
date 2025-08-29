const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const selectedCompanyMiddleware = require('./src/middlewares/selectedCompanyMiddleware.js')

//ROUTES
const appRoutes = require('./src/routes/appRoutes.js')
const getRoutes = require('./src/routes/apisRoutes/getRoutes.js')
const composedRoutes = require('./src/routes/apisRoutes/composedRoutes.js')

const plRoutes = require('./src/routes/apisRoutes/composedRoutes.js')

const app = express()

//use public as statis
app.use(express.static(publicPath))

//get forms info as objects
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
}))

// middlewares
app.use(userLoggedMiddleware)
app.use(selectedCompanyMiddleware)

//Declare and listen port
const APP_PORT = 3012
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',appRoutes)
app.use('/get',getRoutes)
app.use('/composed',composedRoutes)
app.use('/composed',plRoutes) // eliminar

//console.log('malen: ' + bcrypt.hashSync('nicocabrera1891',10))
