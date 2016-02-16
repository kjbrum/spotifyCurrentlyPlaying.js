;(function(global) {
    var Spotify = function(selector, username, api_key, width, height) {
        return new Spotify.init(selector, username, api_key, width, height);
    }

    Spotify.prototype = {
        /*
         * Display the Spotify player
         */
        displayPlayer: function() {
            if(!this.selector) {
                throw 'Missing selector';
            }

            var self = this;
            // Get the most recent track
            this.queryLastfm(function() {
                self.searchSpotify(function() {
                    console.log(self.spotifyURI);
                });
            });



            // TODO
            // Display the Spotify player using the selector and the track information
        },

        /*
         * Validate the supplied Last.FM username and api key
         */
        validateLastFM: function() {
            if(!this.username) {
                throw 'Missing username';
            }

            if(!this.api_key) {
                throw 'Missing api_key';
            }

            console.log('Validating Last.FM...');
            console.log('Username: ' + this.username);
            console.log('API Key: ' + this.api_key);

            // TODO
            // 1. Make an API call to see if the username and api_key work
            // 2. Throw an error if something goes wrong
        },

        /*
         * Get the most recently scrobbled track from Last.fm
         */
        queryLastfm: function(callback) {
            console.log('Querying Last.FM...');
            var self = this;

            // Set the request URL for Last.fm
            var lastfm_request_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+this.username+'&api_key='+this.api_key+'&limit=1&format=json';

            // Make a request to the Last.fm API
            var request = new XMLHttpRequest();
            request.open('GET', lastfm_request_url, true);

            // Check for a successful response
            request.onload = function() {
                if(request.status >= 200 && request.status < 400) {
                    // Success!
                    var data = JSON.parse(request.responseText);
                    var the_track;

                    if(data.recenttracks.track[0]) {
                        the_track = data.recenttracks.track[0];
                    } else {
                        the_track = data.recenttracks.track;
                    }

                    self.lastfmTrack = {
                        title: the_track.name,
                        artist: the_track.artist['#text'],
                        album: the_track.album['#text']
                    };

                    callback(self.lastfmTrack);
                } else {
                    // Error from the server
                    throw 'Some kind of error from the server';
                }
            };

            // Handle any errors
            request.onerror = function() {
                // Connection error
                throw 'Some kind of connection error';
            };

            // Send the request
            request.send();
        },

        /*
         * Search for track information on Spotify
         */
        searchSpotify: function(callback) {
            console.log('Searching Spotify...');

            var self = this;

            var search_query = '';
            var track = self.lastfmTrack;
            for(var key in track) {
                // Skip if the property is from prototype
                if (!track.hasOwnProperty(key)) continue;

                if(track[key]) {
                    search_query += key+':'+track[key]+' ';
                }
            }

            // Set the request URL for Spotify
            var spotify_request_url = 'https://api.spotify.com/v1/search?query='+encodeURIComponent(search_query)+'&offset=0&limit=1&type=track';

            // Make a request to the Spotify API
            var request = new XMLHttpRequest();
            request.open('GET', spotify_request_url, true);

            // Check for a successful response
            request.onload = function() {
                if(request.status >= 200 && request.status < 400) {
                    // Success!
                    var data = JSON.parse(request.responseText);

                    if(data.tracks.items[0]) {
                        self.spotifyURI = data.tracks.items[0].uri;
                    }

                    callback();
                } else {
                    // Error from the server
                    throw 'Some kind of error from the server';
                }
            };

            // Handle any errors
            request.onerror = function() {
                // Connection error
                throw 'Some kind of connection error';
            };

            // Send the request
            request.send();
        }
    };

    Spotify.init = function(selector, username, api_key, width, height) {
        var self = this;

        self.selector = selector || '';
        self.username = username || '';
        self.api_key = api_key || '';
        self.width = width || '300';
        self.height = height || '400';
        self.lastfmTrack = {
            title: '',
            artist: '',
            album: ''
        };
        self.spotifyURI = '';

        // Validate the Last.fm username and api_key
        self.validateLastFM();

        // Display the Spotify player
        self.displayPlayer();
    }

    Spotify.init.prototype = Spotify.prototype;

    global.Spotify = Spotify;
}(window));
