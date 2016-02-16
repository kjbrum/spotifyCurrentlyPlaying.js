;(function(global, $) {
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

            var recentTrack = this.queryLastFM();
            var track = this.searchSpotify(recentTrack.title, recentTrack.artist, recentTrack.album);

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
        },

        /*
         * Get the most recently scrobbled track from LastFM
         */
        queryLastFM: function() {
            console.log('Querying Last.FM...');

            // TODO
            // 1. Make an API call to get the most recent track information
            // 2. Return the results = {title, artist, album}

            return {
                title: 'title',
                artist: 'artist',
                album: 'album'
            };
        },

        /*
         * Search for track information on Spotify
         */
        searchSpotify: function(title, artist, album) {
            console.log('Searching Spotify...');

            // TODO
            // 1. Make an API call to look for the supplied track information
            // 2. Return the track URI if one was found, else throw an error

            return 'uri';
        }
    };

    Spotify.init = function(selector, username, api_key, width, height) {
        var self = this;

        self.selector: selector || '';
        self.username: username || '';
        self.api_key: api_key || '';
        self.width: width || 300;
        self.height: height || 400;

        // Validate the Last.fm username and api_key
        self.validateLastFM();

        // Display the Spotify player
        self.displayPlayer();
    }

    Spotify.init.prototype = Spotify.prototype;

    global.Spotify = Spotify;
}(window, jQuery));
