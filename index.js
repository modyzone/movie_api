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
   title: 'Reservoir Dogs',
   director: 'Quentin Tarantino'
},
{
   title: 'Pulp Fiction',
   director: 'Quentin Tarantino'
},
{
   title: 'In the Mouth of Madness',
   director: 'Stephanie Meyer'
},
{
    title: 'The Dark Knight Rises',
    director: 'Christopher Nolan'
},
{
    title: 'Mirage',
    director: 'Oriol Paulo'
},
{
    title: 'The Butterfly Effect',
    director: 'Eric Bress'
},
{
    title: 'Inception',
    director: 'Christopher Nolan'
},
{
    title: 'Escape Plan',
    director: 'Mikael Håfström'
},
{
    title:'The Matrix',
    director: 'Lana Wachowski'
},
{
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
app.get('/name/title', (req, res) => {
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
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});
// Update the "users" to update the user info (username)
app.put('/users/:name/', (req, res) => {
  let users = users.find((user) => { return user.name === req.params.name });

  if (users) {
    users.name[req.params.name] = parseInt(req.params.name);
    res.status(201).send('User ' + req.params.name + ' was assigned a user of ' + req.params.name );
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