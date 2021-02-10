require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { requireAuth } = require('./middleware/jwt-auth')
const jsonBodyParser = express.json()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(jsonBodyParser)

let epHome = '/'
let epLogin = '/login'
let epSignup = '/signup'
let epSpellIndex = '/spells'
let epSpellView = '/spells/:id'

app.get(epSpellIndex, requireAuth, (req, res) => {
  req.app.get('db')('spells')
    .where({user_id: req.user.id})
    .then((displaySpells) => {
        res.send(displaySpells)
    })
})

app.get(`${epSpellView}`, requireAuth, (req, res) => {
  console.log('Inside /spell/:id server');

  req.app.get('db')('spells')
  .where({id: req.params.id})
  .then((displaySpells) => {
      res.send(displaySpells[0])
  })
})

app.post(`${epSpellView}`, requireAuth, (req, res, next) => {
  req.app.get('db')('spells')
  .where({id: req.params.id})
  .then((spell) => {
      console.log(req.body.text);
      // spell.text = req.body.text;

      // update({text: req.body.text})
      // into('spells')
      // returning('*')
      // then((spell) => {
      //   res.send({message: "Saved new spell text"})
      // })
      res.send({message: "Received"})
  })

})

app.post(epLogin, (req, res) => {
  if(!req.body.username){
    return res.status(400).send({error: `Missing 'username' in request body`})
  }
  if(!req.body.password){
    return res.status(400).send({error: `Missing 'password' in request body`})
  }

  req.app.get('db')('users')
    .where({username: req.body.username})
    .then(async (users) => {
      let user = users[0]
      if (!user){return res.status(400).send({error: "User not found"})}

      let passwordMatch = await bcrypt.compare(req.body.password, user.password)
      if (!passwordMatch){return res.status(400).send({error: "Invalid password"})}

      if (passwordMatch) {
        res.send({message: "Passwords match", 
          authToken: jwt.sign({user_id: user.id}, config.JWT_SECRET, {
            subject: user.username,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
          })
        })
      } else{
        res.send({error: "Passwords do not match"})
      }
      // console.log("User retrieved", users);
    })
})

app.post(epSignup, (req, res, next) => {
  console.log("Inside signup");
  console.log(req.body);
  // TODO: If for when username is missing && if for password missing
  req.app.get('db')('users')
    .where({username: req.body.username})
    .then(async (usersWithUsername) => {
      console.log("Inside then");
      let { password } = req.body

      if (usersWithUsername.length !== 0){return res.status(400).send({error: "Username already taken"})}

      // TODO: try regex with .match() && read match docs
      if (password.length < 8){return res.status(400).send({error: 'Password must be longer than 7 characters'})}
      if (password.length > 72){return res.status(400).send({error: 'Password must be less than 73 characters'})}
      if (password[0] === ' ' || password[password.length-1] === ' '){return res.status(400).send({error: 'Password must not start or end with empty spaces'})}
      if ((/[A-Z]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
      if ((/[a-z]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
      if ((/[0-9]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
      if ((/[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}

      let hashPassword = await bcrypt.hash(req.body.password, 12)
      req.app.get('db')
        .insert({username: req.body.username, password: hashPassword})
        .into('users')
        .returning('*')
        .then((user) => {
          res.send({message: "Account created successfully"})
        })
    })
})


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = { app, epHome, epLogin, epSignup, epSpellIndex, epSpellView }