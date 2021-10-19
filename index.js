const express = require('express'),
 bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});





// import bodyPraser here


// methodOverride = require('method-override');
// set bodyparser
// app.use(bodyParser.urlencoded({ extended: true}))
// use bodyparser json to serialise data
app.use(bodyParser.json());
//use methodOverrid
// app.use(methodOverride())
//use morgan and static
app.use(morgan('common'));
// app.use(express.static('public'));
// GET requests method for request the HTTP (GET, POST, PUT, PATCH, DELETE)
 app.get('/', (req, res)=> {
   res.send('Welcome to myFlixDB!');
});

app.get('/movies', (req, res) => {
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
  Directors.findOne( { Name: req.params.Name })
  .then( (director) => {
    res.json(director);
  })
  .catch( (err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// Allow new users to register.
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).json(user)
        })

        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
  });

  // Add a movie to a user's list of favorites

  app.post('/Users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new : true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
    });

  // Get all users
  app.get('/Users', (req, res) => {
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
app.post ('/users/:Username/movies/:MovieID', (req, res) => {
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
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});