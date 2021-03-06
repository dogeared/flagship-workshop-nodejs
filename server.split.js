const SplitFactory = require('@splitsoftware/splitio').SplitFactory;

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const movies = require('./movies');

var factory = SplitFactory({
  core: {
    authorizationKey: 'localhost' // update to real authorization key
  }
});

var client = factory.client();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', async function(req, res, next) {
  res.json({ status: 'SUCCESS', message: 'I\'m Alive!' });
})

app.get('/api/v1/movies/:email', async function (req, res, next) {
  var treatment = client.getTreatment(req.params.email, 'movie_filter');
  console.log('treatment: ' + treatment);

  res.json({ 
    status: 'SUCCESS', 
    movies: (treatment === 'INTERNATIONAL') ? movies.allMovies : movies.usaMovies 
  });
});

client.on(client.Event.SDK_READY, function () {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
});
