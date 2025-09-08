const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const selectedCompanyMiddleware = require('./src/middlewares/selectedCompanyMiddleware.js')
// const isProd = process.env.NODE_ENV === 'production'

//ROUTES
const appRoutes = require('./src/routes/appRoutes.js')
const getRoutes = require('./src/routes/apisRoutes/getRoutes.js')
const composedRoutes = require('./src/routes/apisRoutes/composedRoutes.js')

const plRoutes = require('./src/routes/apisRoutes/composedRoutes.js')

const app = express()

app.set('trust proxy', 1) // if Cloudflare/NGINX 

// unable cache
app.disable('etag')
app.set('view cache', false)

// middleware global anti-cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  // Opcional si usás un CDN: ayuda a que respete cookies de sesión
  res.set('Vary', 'Cookie')
  next()
})

//use public as statis without cache
app.use(express.static(publicPath, {
  etag: false,
  lastModified: false,
  cacheControl: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
  }
}))

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

// app.use(session({
//   name: 'connect.sid',          // nombre por defecto; podés cambiarlo
//   secret: process.env.SESSION_SECRET || 'cambiame-por-env',
//   resave: false,
//   saveUninitialized: false,
//   store: new FileStore({
//     path: path.join(__dirname, './sessions'), // carpeta donde guardar
//     retries: 0,
//     ttl: 60 * 60 * 24 // 1 día en segundos
//   }),
//   cookie: {
//     httpOnly: true,
//     sameSite: 'lax',            
//     secure: isProd,             // TRUE solo si el usuario entra por HTTPS
//     maxAge: 1000 * 60 * 60 * 2  // 2 horas
//   }
// }))

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