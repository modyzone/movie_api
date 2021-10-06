const express = require('express');
const app = express();
morgan = require('morgan');
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
// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});