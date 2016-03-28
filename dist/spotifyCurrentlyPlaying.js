/**
 *
 *  -----------------------------------
 *  spotifyCurrentlyPlaying.js - v0.3.1
 *  -----------------------------------
 *
 *  Display your currently playing Spotify song(s) using Last.fm scrobbling.
 *
 *  https://github.com/kjbrum/spotifyCurrentlyPlaying.js
 *  @license Copyright (c) Kyle Brumm <http://kylebrumm.com>
 *
 */

;
(function(global) {
    var SpotifyCurrentlyPlaying = function(settings) {
        return new SpotifyCurrentlyPlaying.init(settings);
    }

    SpotifyCurrentlyPlaying.prototype = {
        /******************************
         * Display the Spotify player *
         ******************************/
        displayPlayer: function() {
            var self = this;

            // Check for missing selector
            if (!this.selector) {
                throw 'Missing selector';
            }

            // Get the most recent track
            self.queryLastfm(function() {

                // Search Spotify for the track
                self.searchSpotify(function() {
                    var container = self.selector;

                    // Check the type of selector that was supplied
                    if (typeof self.selector === 'string') {
                        container = document.querySelector(self.selector);
                    }

                    // Display the iframe if we found a track URI
                    if (self.spotify_URIs.length > 0 || self.backup_ids.length > 0) {
                        var track_uri = '';
                        var iframe = document.createElement('iframe');

                        // Build the iframe
                        iframe.width = self.width;
                        iframe.height = self.height;
                        iframe.frameBorder = 0;
                        iframe.setAttribute('allowtransparency', 'true');

                        // Check if we found anything or need to show backup tracks
                        if (self.spotify_URIs.length > 0) {
                            // Check if we found multiple tracks
                            if (self.spotify_URIs.length > 1) {
                                track_uri += 'spotify:trackset:Recently+Played:'

                                // Loop through the Spotify URIs
                                self.spotify_URIs.forEach(function(el, idx, arr) {
                                    var track_pieces = arr[idx].split(':');
                                    track_uri += track_pieces[2];

                                    if ((idx + 1) !== arr.length) {
                                        track_uri += ',';
                                    }
                                });
                            } else {
                                track_uri = self.spotify_URIs[0];
                            }
                        } else {
                            // Check if we have multiple backup IDs
                            if (self.backup_ids.length > 1) {
                                track_uri += 'spotify:trackset:Recently+Played:'

                                // Loop through the backup IDs
                                self.backup_ids.forEach(function(el, idx, arr) {
                                    track_uri += arr[idx];

                                    if ((idx + 1) !== arr.length) {
                                        track_uri += ',';
                                    }
                                });
                            } else {
                                track_uri = self.backup_ids[0];
                            }
                        }

                        iframe.src = 'https://embed.spotify.com/?uri=' + track_uri + '&theme=' + self.theme + '&view=' + self.view;
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
            var lastfm_request_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + this.username + '&api_key=' + this.api_key + '&limit=' + self.count + '&format=json';

            // Make a request to the Last.fm API
            var request = new XMLHttpRequest();
            request.open('GET', lastfm_request_url, true);

            // Check for a successful response
            request.onload = function() {
                // Parse the response
                var data = JSON.parse(request.responseText);
                var tracks = data.recenttracks.track;

                // Check the status of the request
                if (request.status >= 200 && request.status < 400) {
                    if (tracks.length > 0) {
                        // Update our values
                        if (tracks[0]) {
                            // Loop through the tracks
                            tracks.forEach(function(el, idx, arr) {
                                self.lastfm_tracks[idx] = {
                                    title: arr[idx].name,
                                    artist: arr[idx].artist['#text'],
                                    album: arr[idx].album['#text']
                                };
                            });
                        } else {
                            self.lastfm_tracks.push({
                                title: tracks.name,
                                artist: tracks.artist['#text'],
                                album: tracks.album['#text']
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
            var tracks = self.lastfm_tracks;
            var tracksProcessed = 1;

            if (tracks.length > 0) {
                // Loop through the tracks
                tracks.forEach(function(el, idx, arr) {
                    var search_query = '';

                    // Loop through the track properties
                    for (var key in el) {
                        // Skip if the property is from prototype
                        if (!el.hasOwnProperty(key)) continue;

                        // Build the search query string
                        if (el[key]) {
                            search_query += key + ':' + el[key] + ' ';
                        }
                    }

                    // Set the request URL for Spotify
                    var spotify_request_url = 'https://api.spotify.com/v1/search?query=' + encodeURIComponent(search_query) + '&offset=0&limit=1&type=track';

                    // Make a request to the Spotify API
                    var request = new XMLHttpRequest();
                    request.open('GET', spotify_request_url, true);

                    // Check for a successful response
                    request.onload = function() {
                        // Parse the response
                        var data = JSON.parse(request.responseText);

                        // Check the status of the request
                        if (request.status >= 200 && request.status < 400) {
                            // Update our values
                            if (data.tracks.items[0]) {
                                // If we found a track, push it into our array
                                self.spotify_URIs[idx] = data.tracks.items[0].uri;
                            }

                            // tracksProcessed++;
                            // Check if we are on the last track
                            if (++tracksProcessed === arr.length) {
                                // Remove empty array value
                                self.spotify_URIs = self.spotify_URIs.filter(function(n) {
                                    return n;
                                });

                                // Run the callback function
                                callback();
                            }
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
                });
            } else {
                // Run the callback function if no tracks were found
                callback();
            }
        }
    };

    /*************************************
     *  Initializing our function *
     *************************************/
    SpotifyCurrentlyPlaying.init = function(settings) {
        var self = this;

        // Setup settings
        self.selector = settings.selector || '.scp-container'; // Selector for the container
        self.username = settings.username || ''; // LastFM username
        self.api_key = settings.api_key || ''; // LastFM API key
        self.width = settings.width || 300; // Width of the player
        self.height = settings.height || 400; // Height of the player
        self.theme = settings.theme || 'black'; // Theme of the player
        self.view = settings.view || 'list'; // View of the player
        self.count = parseInt(settings.count) || 1; // Number of tracks to display
        self.backup_ids = settings.backup_ids || []; // Backup IDs of tracks to display if no tracks are found

        // Used for storing data
        self.spotify_URIs = []; // Spotify URIs
        self.lastfm_tracks = []; // Array of LastFM track info

        // Display the Spotify player
        self.displayPlayer();
    }

    SpotifyCurrentlyPlaying.init.prototype = SpotifyCurrentlyPlaying.prototype;

    global.SpotifyCurrentlyPlaying = global.SCP = SpotifyCurrentlyPlaying;
}(window));
