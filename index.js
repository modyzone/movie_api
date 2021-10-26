const express = require('express');
 bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan');

const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
const cool = require('cool-ascii-faces');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const path = require('path');
const PORT = process.env.PORT || 5000;
express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/', (req, res) => res.render('pages/index'))
.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'result': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send('Error ' + err);
  }
})
.get('/cool', (req, res) => res.send(cool()))
.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;


 //mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
   //useNewUrlParser: true, 
   //useUnifiedTopology: true,
 //});
 ( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

 const cors = require('cors');
 let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
 app.use(cors({
   origin: (origin, callback) => {
     if(!origin) return callback(null, true);
     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn't found on the list of allowed origins
    let message = 'The CORS policy for this application doesn not allow access from origin' + origin;
  return callback(new Error(message), false);
}
return callback(null, true);
   }
 }));
 let auth = require('./auth')(app);
 const passport = require('passport');
 require('./passport');
// use bodyparser json to serialise data
//use methodOverrid
// app.use(methodOverride())
// import bodyPraser here
// methodOverride = require('method-override');
// set bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
//use morgan and static
app.use(morgan('common'));
app.use(express.static('public'));
// GET requests method for request the HTTP (GET, POST, PUT, PATCH, DELETE)
 app.get('/', (req, res)=> {
   res.send('Welcome to myFlixDB!');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then( (movies) => {
    res.status(201).json(movies);
  })
  .catch( (err) => { 
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
app.get('/movies/:Title', (req, res) => {
  Movies.findOne( { Title: req.params.Title })
   .then( (movie) => {
     res.json(movie);
   })
   .catch( (err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   })
  });

app.get('/directors/:Name', (req, res) => {
  Movies.findOne( { 'Director.Name': req.params.Name })
  .then( (director) => {
    res.json(director);
  })
  .catch( (err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get the movie by Genre
app.get('/genres/:Name', (req, res) => {
  Movies.findOne( { 'Genre.Name': req.params.Name })
  .then( (genre) => {
    res.json(genre);
  })
  .catch( (err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
//times repeats an action depending on the value of TIMES envirnomental variable
app.get('/times', (req, res) => res.send(showTimes()))
showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
};
// Allow new users to register.
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        // If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {
          res.status(201).json(user);
        })
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
  
  // Get all users
  app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
      .then((users) => {
          console.log("====users" , users)
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err);
      });
  });
  // Get a user by username
  app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(error);
        res.status(500).send('Error: ' + err);
      });
      });
 
// Update the "users" to update the user info (username)
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
  {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }
},
{ new: true }, // This line makes sure that the updated document is returned
(err, updatedUser ) => {
  if(err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
});
});
// Remove movie from username'list:
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
Users.findOneAndUpdate({ Username: req.params.Username },

  { $pull: { Fav: req.params.MovieID } },
  
  { new: true }
  ).then((user)=>{
    res.status(200).json(user);
    } )
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error:' + error);
    });
  
  });
 

// Allow users to remove a movie from their list of favorites 
//(showing only a text that a movie has been removed—more on this later)
// Delete user by username
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

  // add movie to username's list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate( { Username: req.params.Username } , { 
    $push: { Fav: req.params.MovieID } 
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

app.get('/documentation' , (req, res) => {
  res.sendFile('public/documentation.html',  { root: __dirname});
});
// access documentation.html using express.static
app.use('/documentation', express.static('public'));

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});