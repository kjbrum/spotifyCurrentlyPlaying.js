/**
 *
 *  -----------------------------------
 *  spotifyCurrentlyPlaying.js - v0.3.0
 *  -----------------------------------
 *
 *  Display your currently playing Spotify song using Last.fm scrobbling.
 *
 *  https://github.com/kjbrum/spotifyCurrentlyPlaying.js
 *  @license Copyright (c) Kyle Brumm <http://kylebrumm.com>
 *
 */

;(function(global) {
    var SpotifyCurrentlyPlaying = function(settings) {
        return new SpotifyCurrentlyPlaying.init(settings);
    }

    SpotifyCurrentlyPlaying.prototype = {
        /******************************
         * Display the Spotify player *
         ******************************/
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
                    var container = self.selector;

                    // Check the type of selector that was supplied
                    if(typeof(self.selector) === 'string') {
                        container = document.querySelector(self.selector);
                    }

                    // Display the iframe if we found a track URI
                    if(self.spotifyURIs != '' || self.backup_id != '') {
                        var iframe = document.createElement('iframe');
                        iframe.width = self.width;
                        iframe.height = self.height;
                        iframe.frameBorder = 0;
                        iframe.setAttribute('allowtransparency', 'true');

                        var track_uri;
                        // Decide if we found a track or are showing the backup
                        if(self.spotifyURIs != '') {
                            track_uri = self.spotifyURIs;
                        } else {
                            track_uri = 'spotify:track:'+self.backup_id;
                        }

                        iframe.src = 'https://embed.spotify.com/?uri='+track_uri+'&theme='+self.theme+'&view='+self.view;
                        container.appendChild(iframe);
                    } else {
                        var paragraph = document.createElement('p');
                        var paragraph_text = document.createTextNode('No track found.');
                        paragraph.appendChild(paragraph_text);
                        container.appendChild(paragraph);
                    }
                });
            });
        },

        /******************************************************
         * Get the most recently scrobbled track from Last.fm *
         ******************************************************/
        queryLastfm: function(callback) {
            var self = this;

            // Set the request URL for Last.fm
            var lastfm_request_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+this.username+'&api_key='+this.api_key+'&limit='+self.count+'&format=json';

            // Make a request to the Last.fm API
            var request = new XMLHttpRequest();
            request.open('GET', lastfm_request_url, true);

            // Check for a successful response
            request.onload = function() {
                // Parse the response
                var data = JSON.parse(request.responseText);

                if(request.status >= 200 && request.status < 400) {

                    console.log(data.recenttracks);

                    if(data.recenttracks.track.length > 1) {
                        // Update our values
                        if(data.recenttracks.track[0]) {

                            // Loop through the tracks
                            data.recenttracks.track.forEach(function(el, idx) {
                                self.lastfmTracks.push({
                                    title: data.recenttracks.track[idx].name,
                                    artist: data.recenttracks.track[idx].artist['#text'],
                                    album: data.recenttracks.track[idx].album['#text']
                                });
                            });
                        } else {
                            self.lastfmTracks.push({
                                title: data.recenttracks.track.name,
                                artist: data.recenttracks.track.artist['#text'],
                                album: data.recenttracks.track.album['#text']
                            });
                        }
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
        },

        /*******************************************
         * Search for track information on Spotify *
         *******************************************/
        searchSpotify: function(callback) {
            var self = this;
            var search_query = '';
            var track = self.lastfmTracks;

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
                        self.spotifyURIs = data.tracks.items[0].uri;
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

    /*************************************
     *  Initializing our function *
     *************************************/
    SpotifyCurrentlyPlaying.init = function(settings) {
        var self = this;

        // Setup settings
        self.selector    = settings.selector || '';          // Selector for the container
        self.username    = settings.username || '';          // LastFM username
        self.api_key     = settings.api_key || '';           // LastFM API key
        self.width       = settings.width || '300';          // Width of the player
        self.height      = settings.height || '400';         // Height of the player
        self.theme       = settings.theme || 'black';        // Theme of the player
        self.view        = settings.view || 'list';          // View of the player
        self.count       = parseInt(settings.count) || 1;    // Number of tracks to return
        self.backup_id   = settings.backup_id || '';         // Backup ID of track to display if a track isn't found

        // Used for storing data
        self.spotifyURIs;                                    // Spotify URIs
        self.lastfmTracks = [];                              // Array of LastFM track info

        // Display the Spotify player
        self.displayPlayer();
    }

    SpotifyCurrentlyPlaying.init.prototype = SpotifyCurrentlyPlaying.prototype;

    global.SpotifyCurrentlyPlaying = global.SCP = SpotifyCurrentlyPlaying;
}(window));
