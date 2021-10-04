const express = require('express');
const app = express();
morgan = require('morgan');

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
app.get('/topMovies', (req, res) => {
  res.json(topMovies);
}); 
// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

const bodyParser = require('body-parser');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});