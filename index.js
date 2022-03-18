
const express = require('express');
bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan');

const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
const cool = require('cool-ascii-faces');
const { check, validationResult } = require('express-validator');







mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
/**
 * cors
 * @constant
 * @type {object}
 * @default
 */
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://stoic-lamarr-a93db0.netlify.app'];
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use morgan and static
app.use(morgan('common'));
app.use(express.static('public'));

/**
 * redirects root to index.html
 * @param {express.request} req
 * @param {express.response} res
 */
// GET requests method for request the HTTP (GET, POST, PUT, PATCH, DELETE)
app.get('/', (req, res) => {
  res.send('Welcome to myFlixDB!');
});


const Movies = Models.Movie;
const Users = Models.User;
/**
 * /movies endpoint
 * method: get
 * get all movies
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * /movies/:Title endpoint
 * get: movie by title
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
 * /directors endpoint
 * method: get
 * all directors
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/directors/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * /genres endpoint
 * method: get
 * all genres
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/genres/:Name', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * /users endpoint
 * method: get
 * get user profile
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      console.log("====users", users)
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Error: ' + err);
    });
});

/**
 * /users endpoint
 * method: post
 * register user profile
 * expects Username, Password, Email, Birthday
 * @param {express.request} req
 * @param {express.response} res
 */
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/**
 * /users endpoint
 * method: get
 * get user by username
 * @param {express.request} req
 * @param {express.response} res
 */

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {//error callback
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



/**
 * /users/ endpoint
 * method: put
 * update user profile
 * expects Username, Password, Email, Birthday
 * @param {express.request} req
 * @param {express.response} res
 */
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


/**
 * /users endpoint
 * method: delete
 * delete user profile
 * @param {express.request} req
 * @param {express.response} res
 */
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },

    { $pull: { FavoriteMovies: req.params.MovieID } },

    { new: true }
  ).then((user) => {
    res.status(200).json(user);
  })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error:' + error);
    });

});


/**
 * /users endpoint
 * method: delete
 * delete user profile
 * @param {express.request} req
 * @param {express.response} res
 */
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * /users endpoint
 * method: post
 * add movie to username's list
 * @param {express.request} req
 * @param {express.response} res
 */

app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // this line makes sure that the updates document is retuned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * redirects /documentation to documentation.html
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});
// access documentation.html using express.static
app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});
// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
