require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var SpotifyLink = new Spotify(keys.spotify);

var input = process.argv[2];
var spotify;
var ombd;
var artist;

//conditional for concerts 
if (input === "concert-this") {
  artist = process.argv.slice(3).join(" ");
  // console.log(process.argv.slice(3))
  concertAPI();
}

//conditional for spotify
else if (input === "spotify-this-song") {
  spotify = process.argv.slice(3).join(" ");
  // console.log(process.argv.slice(3).join(" "));
  spotifyApi();
}

//condition for movie 
else if (input === "movie-this") {
  ombd = process.argv.slice(3).join(" ");
  moviesApi();
}

//conditional for do what it says 
else if (input === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // We will then print the contents of data  
    console.log(data);
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    spotify = dataArr[1];
    // We will then re-display the content as an array for later use.
    console.log(dataArr[1]);
    spotifyApi();
  });
}

//concert function 
function concertAPI() {
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
      if (response.data == 'undefined' || response.data == "") {
        console.log(artist + " is not currently touring. Sorry.")
      } else {
        for (var i = 0; i < response.data.length; i++) {
          var momentDate = moment(response.data[i].datetime);
          console.log("=========================================")
          console.log(artist + " CONCERT SHOWTIMES:")
          console.log("Concert Date: " + momentDate.format("MM/DD/YYYY"));
          console.log("Venue Name: " + response.data[i].venue.name);
          console.log("City: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
          // console.log(response);
          console.log("=========================================")
        }
      }
    })
};

function moviesApi()  {
  if (ombd === "") {
    axios.get("http://www.omdbapi.com/?t=Mr._Nobody&y=&plot=short&apikey=trilogy")
  .then(function (response) {
    console.log("===============================")
      console.log("Movie Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatos Rating: " + response.data.Ratings[1].Value);
      console.log("Produced in: " + response.data.Country);
      console.log("Language: " +  response.data.Language);
      console.log("Movie Plot: " + response.data.Plot);
      console.log("Lead Actors: " + response.data.Actors);
      console.log("===============================")
    }
  );
  }

    else { 
      axios.get("http://www.omdbapi.com/?t=" + ombd + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
      // console.log(response);
      console.log("===============================")
      console.log("Movie Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatos Rating: " + response.data.Ratings[1].Value);
      console.log("Produced in: " + response.data.Country);
      console.log("Language: " +  response.data.Language);
      console.log("Movie Plot: " + response.data.Plot);
      console.log("Lead Actors: " + response.data.Actors);
      console.log("===============================")
    })};
  };

  function spotifyApi() {
    if (spotify === ""){
      // console.log("foo");
      SpotifyLink.search({ type: 'track', query: "The Sign Ace of Base" }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("=========================================")
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Preview Url: " + data.tracks.items[0].preview_url);
        console.log("Album Name: " + data.tracks.items[0].album.name);
        console.log("=========================================");
      // console.log(data);
      // console.log(data.tracks.items[0]);
      // console.log(data.tracks.items[0].album.artists[0]);
    });
  }

  else {  
    // console.log("bar");
    SpotifyLink.search({ type: 'track', query: spotify }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
        console.log("=========================================")
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Preview Url: " + data.tracks.items[0].preview_url);
        console.log("Album Name: " + data.tracks.items[0].album.name);
        console.log("=========================================")
  // console.log(data);
  });
}
}
