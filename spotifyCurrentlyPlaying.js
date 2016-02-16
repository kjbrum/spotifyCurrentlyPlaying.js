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

            // TODO
            // 1. Query Last.FM
            // 2. Search Spotify for the track
            // 3. Display the Spotify player using the selector
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
