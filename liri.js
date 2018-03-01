//command as required in the HW instructions
require("dotenv").config();

// allows access to keys.js, which contains my twitter and spotify api keys by way of .env file
//.env file is in gitnore which hides them from other people
var keys = require("./keys.js");

// allows access to twitter, request, spotify, movie and fs node packages
//these variables were found in the corresponding documentation
var Twitter = require("twitter");
var omdb = require("request");
var Spotify = require('node-spotify-api');

//put this in code to allow you to work with the file system on your computer (w3 schools)
var fs = require("fs");


// variable for the question being asked liri
// i.e. my-tweets" or "spotify song
//use arg 2 because the array I want starts here
var askLiri = process.argv[2];

// variable for the search term following the question
// movie name in this case
var movieName = process.argv[3];

// variable that will change the search term if the "do-what-it-says" command is run
var readFile = false;

// variable for counting the results from commands
var num = 0;



// function for accessing Twitter aka  "my-tweets"
function searchTweets() {
  console.log("Liri is loading your tweets...");
  //you can also use \n here
  console.log("-----------------------------------------------------------");

  //these lines were taken from Twitter documentation
  var client = new Twitter(keys.twitter);

  //changed node.js in the twitter docs to my screen name 
  var params = { screen_name: 'ClutchMyPearlz' };

  //error, response and tweets values come from api
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      // for loop to loop through 20 tweets that will be shown
      for (i = 0; i < 20; i++) {
        num++;

        console.log(num);
        console.log(tweets[i].created_at);
        console.log(tweets[i].text);
        console.log("-----------------------------------------------------------");
      }
    }
    num = 0;
  });
}


// function for accessing OMDB aka "movie-this"
function searchMovie() {
  console.log("Liri is finding your movie...");
  console.log("-----------------------------------------------------------");

  // if there is no movieName, use "Mr. Nobody" as default
  if (!movieName) {
    movieName = "Mr. Nobody";
  }

  //using trilogy api key
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


  // This line is just to help us debug against the actual URL.
  //console.log(queryUrl);

  omdb(queryUrl, function (error, response, body) {
    // the request being successful is equivilant to "200"
    if (!error && response.statusCode === 200) {
      //parse turns string into an object...pulls info out one by one
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Year Released: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Starring: " + JSON.parse(body).Actors);
    }
  });
}

// function for accessing Spotify aka "spotify-this-song"
function searchSong() {
  console.log("Liri is searching Spotify...");
  console.log("-----------------------------------------------------------");

  // spotify variable as listed in HW instructions
  //this pulls the keys in from the key.js by way of .env
  //so no one can see them
  //this is from the Spotofy documentation
  var spotify = new Spotify(keys.spotify);

  var songName = process.argv[3];

  // readfile is set to true when the read function is run
  if (readFile === true) {
    songName = "I want it that way";
    readFile = false;
  }
  // if there is no songName, use "the sign" as default
  if (!songName) {
    songName = "the sign";
  }

  // search spotify for track name, limit results to 20.
  //this comes from the Spotify documentation
  spotify.search({ type: 'track', query: songName, limit: 20 }, function (err, data) {
    if (err) {
      console.log("Sorry, Liri is having trouble finding your song.");
      return console.log('Error occurred: ' + err);
    }

    for (i = 0; i < 20; i++) {
      num++

      // prints out the artist, song, link and album
      //the null is always used
      //the 2 makes it look pretty
      console.log(num);
      console.log(JSON.stringify("Artist: " + data.tracks.items[i].album.artists[0].name, null, 2));
      console.log(JSON.stringify("Song Name: " + data.tracks.items[i].name, null, 2));
      console.log(JSON.stringify("Preview Link: " + data.tracks.items[i].album.artists[0].external_urls.spotify, null, 2));
      console.log(JSON.stringify("Album Name: " + data.tracks.items[i].album.name, null, 2));
      console.log("-----------------------------------------------------------");
    }
  });
  num = 0;
}


// function for "do-what-it-says"
function read() {
  console.log("Liri is doing what it says...");
  console.log("-----------------------------------------------------------");

  readFile = true;

  // reads from file random txt
  fs.readFile("random.txt", "utf8", function (error, data) {
    console.log(data);
    // search spotify
    searchSong();
  });
}


// switch statement determines which question liri is being asked.
switch (askLiri) {
  case "my-tweets":
    // searches twitter for recent tweets
    searchTweets();
    break;
  case "spotify-this-song":
    // searches spotify for songs based on the songName user input
    searchSong();
    break;
  case "movie-this":
    // searches OMDB for movie title based on search parameter
    searchMovie();
    break;
  case "do-what-it-says":
    // reads file using fs, and runs search spotify
    read();
    break;
  default:
    // default statement if liri doesn't know the command
    console.log("Sorry, Liri doesn't know that command.");
}