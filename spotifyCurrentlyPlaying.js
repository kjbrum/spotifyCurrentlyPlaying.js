;(function(global, $) {
    var Spotify = function(selector, username, api_key, width, height) {
        return new Spotify.init(selector, username, api_key, width, height);
    }

    Spotify.prototype = {
        displayPlayer: function(selector, width, height) {
            if(!selector) {
                throw 'Missing selector';
            }

            var msg;
            if(formal) {
                msg = this.formalGreeting();
            } else {
                msg = this.greeting();
            }

            $(selector).html(msg);

            return this;
        }

    };

    Spotify.init = function(selector, username, api_key, width, height) {
        var self = this;

        self.selector: selector || '';
        self.username: username || '';
        self.api_key: api_key || '';
        self.width: width || 300;
        self.height: height || 400;

        // TODO
        // Validate the Last.fm username and api_key

        self.displayPlayer(selector, width, height);
    }

    Spotify.init.prototype = Spotify.prototype;

    global.Spotify = Spotify;
}(window, jQuery));
