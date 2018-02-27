require("dotenv").config();

var liriTalk = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//twitter request
client.get(path, params, callback);
client.post(path, params, callback);
client.stream(path, params, callback);

//spotify request
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: <b94522a84fe844c8a76cafa194f84981>,
  secret: <8e1116ce82b944e9bf97e678e98ea8e6>
});
 
spotify
  .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
  .then(function(data) {
    console.log(data); 
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });

