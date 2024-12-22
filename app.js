const path=require('path')
const express = require('express')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB=require('./config/db')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')

dotenv.config({ path: './config/config.env' })
require('./config/passport')(passport)
connectDB()
const app=express()

//body parser middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebar heplers
const{formatDate,editIcon,select,}=require('./helpers/hbs')
// Handlebars
app.engine( '.hbs',exphbs(
  {helpers:{formatDate,editIcon,select},
  defaultLayout: 'main',
  extname: '.hbs',}))
  app.set('view engine', '.hbs')

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

  
//Static Folder
app.use(express.static(path.join(__dirname,'public')))

  //Routes
  app.use('/',require('./routes/index'))
  app.use('/auth',require('./routes/auth'))
  app.use('/playlists',require('./routes/playlists'))
  app.use('/songs',require('./routes/songs'))

const PORT=process.env.PORT || 5000
app.listen(PORT,
    console.log(`port ${PORT} running on ${process.env.NODE_ENV} mode`)
)