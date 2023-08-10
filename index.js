require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const passport = require('passport');

const app = express()

app.use(express.static("public"))
app.use(express.json()) //Middleware for apis, for example when using fetch from the client.
app.use(express.urlencoded({ extended: true })) //middleware that allow us to access information comming from forms

//setup the template engine
app.set('view engine', 'ejs')

/* Setup cookie middleware. With this, express is able to decode cookie data */
app.use(cookieParser());

/* Session middleware  */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, //Only save the session to the store if the session have been modified
  saveUninitialized: false, // Don't save unitilizaded sessions
  cookie: {
      path: '/', // Global path, i.e, all pages can access this cookie
      secure: false, // The cookie can be send over http
      httpOnly: true, // Client code will not allow to access or modify the cookie
      maxAge: 3600000 // an hour, assign more time if you want to
  }
}))
app.use(passport.authenticate('session'))

const mainRouter = require("./routes/main")
const authRouter = require("./routes/auth")

app.use('/', mainRouter)
app.use('/api/auth', authRouter)

app.listen(process.env.PORT || 3000, "0.0.0.0")