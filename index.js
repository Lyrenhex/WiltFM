const request = require("request")
const querystring = require("querystring")

const API = "https://wilt.fm/api/";

class WiltFM {
  constructor (username, password, callback) {
    this.Auth = {
      'token': '',
      'drfHeader': ''
    };

    var that = this;

    request.post (
      `${API}api-token-auth/`,
      { json: {
        'username': username,
        'password': password
      }},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Connected to Wilt API and logged in');
          that.Auth.token = body.token;
          that.Auth.drfHeader = `Token ${that.Auth.token}`;
          callback(true);
        } else if (!error) {
          // it's a server thingo
          console.log("Wilt API is experiencing issues, offline, whatever.");
          callback(false);
        } else {
          throw error;
        }
      }
    )
  }

  scrobble (song, artist, album, callback) {
    request ({
      headers: {
        'Authorization': this.Auth.drfHeader
      },
      url: `${API}scrobbles/`,
      json: true,
      body: {
        'song': song,
        'artist': artist,
        'album': album
      },
      method: 'POST'
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(`Scrobbled ${song} by ${artist} on the album ${album}.`);
        callback(true, song, artist, album);
      } else if (!error) {
        // nah, another server issue
        callback(false);
      } else {
        throw error;
      }
    });
  }
}

exports.WiltFM = WiltFM;
exports.wiltFm = WiltFM;
