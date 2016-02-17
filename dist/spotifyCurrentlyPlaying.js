/**
 *
 *  ----------------------------------
 *  spotifyCurrentlyPlaying.js - v1.0.0
 *  ----------------------------------
 *
 *  Display your currently playing Spotify song using Last.fm scrobbling.
 *
 *  https://github.com/kjbrum/spotifyCurrentlyPlaying.js
 *  @license Copyright (c) Kyle Brumm <http://kylebrumm.com>
 *
 */

;(function(global) {
    var Spotify = function(selector, username, api_key, width, height) {
        return new Spotify.init(selector, username, api_key, width, height);
    }

    Spotify.prototype = {
        /*
         * Display the Spotify player
         */
        displayPlayer: function() {
            // Check for missing selector
            if(!this.selector) {
                throw 'Missing selector';
            }

            var self = this;
            // Get the most recent track
            this.queryLastfm(function() {
                // Search Spotify for the track
                self.searchSpotify(function() {
                    // Display the iframe if we found a track URI
                    if(self.spotifyURI != '') {
                        // Check the type of selector that was supplied
                        if(typeof(self.selector) === 'string') {
                            container = document.querySelector(self.selector);
                        }

                        // Build the iframe element
                        var iframe = document.createElement('iframe');
                        iframe.width = self.width;
                        iframe.height = self.height;
                        iframe.src = 'https://embed.spotify.com/?uri='+encodeURIComponent(self.spotifyURI);
                        iframe.frameBorder = 0;
                        iframe.setAttribute('allowtransparency', 'true');
                        container.appendChild(iframe);
                    } else {
                        console.log('No tracks were found on Spotify.');
                    }
                });
            });
        },

        /*
         * Get the most recently scrobbled track from Last.fm
         */
        queryLastfm: function(callback) {
            var self = this;

            // Set the request URL for Last.fm
            var lastfm_request_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+this.username+'&api_key='+this.api_key+'&limit=1&format=json';

            // Make a request to the Last.fm API
            var request = new XMLHttpRequest();
            request.open('GET', lastfm_request_url, true);

            // Check for a successful response
            request.onload = function() {
                // Parse the response
                var data = JSON.parse(request.responseText);

                if(request.status >= 200 && request.status < 400) {
                    var the_track;

                    // Update our values
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

                    // Run the callback function
                    callback();
                } else {
                    // Error from the server
                    throw data.message;
                }
            };

            // Handle any errors
            request.onerror = function() {
                // Connection error
                throw 'connection error';
            };

            // Send the request
            request.send();
        },

        /*
         * Search for track information on Spotify
         */
        searchSpotify: function(callback) {
            var self = this;
            var search_query = '';
            var track = self.lastfmTrack;

            for(var key in track) {
                // Skip if the property is from prototype
                if (!track.hasOwnProperty(key)) continue;

                // Build the search query string
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
                // Parse the response
                var data = JSON.parse(request.responseText);

                if(request.status >= 200 && request.status < 400) {
                    // Update our values
                    if(data.tracks.items[0]) {
                        self.spotifyURI = data.tracks.items[0].uri;
                    }

                    // Run the callback function
                    callback();
                } else {
                    // Error from the server
                    throw data.message;
                }
            };

            // Handle any errors
            request.onerror = function() {
                // Connection error
                throw 'connection error';
            };

            // Send the request
            request.send();
        }
    };

    // Handle initializing our function
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

        // Display the Spotify player
        self.displayPlayer();
    }

    Spotify.init.prototype = Spotify.prototype;

    global.Spotify = global.SCP = Spotify;
}(window));
