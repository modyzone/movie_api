const express = require('express');
const app = express();
morgan = require('morgan');
uuid = require('uuid');
// import bodyPraser here
const bodyParser = require('body-parser'),
methodOverride = require('method-override');
// set bodyparser
app.use(bodyParser.urlencoded({ extended: true}))
// use bodyparser json to serialise data
app.use(bodyParser.json())
//use methodOverrid
app.use(methodOverride())
//use morgan and static
app.use(morgan('common'))
app.use(express.static('public'));

let topMovies = [
{
  id: 1,
   title: 'Reservoir Dogs',
   director: 'Quentin Tarantino'
},
{
  id: 2,
   title: 'Pulp Fiction',
   director: 'Quentin Tarantino'
},
{
  id: 3,
   title: 'In the Mouth of Madness',
   director: 'Stephanie Meyer'
},
{
    id: 4,
    title: 'The Dark Knight Rises',
    director: 'Christopher Nolan'
},
{
    id: 5,
    title: 'Mirage',
    director: 'Oriol Paulo'
},
{
    id: 6,
    title: 'The Butterfly Effect',
    director: 'Eric Bress'
},
{
    id: 7,
    title: 'Inception',
    director: 'Christopher Nolan'
},
{
    id: 8,
    title: 'Escape Plan',
    director: 'Mikael Håfström'
},
{
    id: 9,
    title:'The Matrix',
    director: 'Lana Wachowski'
},
{   id: 10,
    title: 'Donnie Brasco',
    director: 'Mike Newell'
}
];

// GET requests method for request the HTTP (GET, POST, PUT, PATCH, DELETE)
 app.get('/', (req, res)=> {
   res.send('Welcome to my Movies club!');
});
app.get('/documentation' , (req, res) => {
  res.sendFile('public/documentation.html',  { root: __dirname});
});
app.get('/movies', (req, res) => {
  res.json(topMovies);
});
app.get('/movies/title', (req, res) => {
  res.send('The Best 10 Movies!');
});
app.get('/director', (req, res) => {
  res.send('Quentin Tarantino');
});
// Allow new users to register.
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid;
    users.push(newUser);
    res.status(201).send(newUser);
  }
});
// Update the "users" to update the user info (username)
app.put('/users/:name/:favorite/:topic', (req, res) => {
  let user = user.find((user) => { return user.name === req.params.name });

  if (user) {
    user.favorite[req.params.favorite] = parseInt(req.params.topic);
    res.status(201).send('User ' + req.params.name + ' was assigned a topic of ' + req.params.topic +  ' in ' + req.params.favorite );
  } else {
    res.status(404).send('User with the name ' + req.params.name + ' was not found.');
  }
});

// Allow users to remove a movie from their list of favorites 
//(showing only a text that a movie has been removed—more on this later)
app.delete('/users/:id', (req, res) => {
  let user = user.find((user) => { return user.id === req.params.id });

  if (user) {
    user = user.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('User ' + req.params.id + ' was deleted.');
  }
});
// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});