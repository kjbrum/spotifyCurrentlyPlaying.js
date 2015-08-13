/**
 *  Spotify Currently Playing v0.0.1
 *  https://github.com/kjbrum/spotify-currently-playing
 *  Kyle Brumm (http://kylebrumm.com)
 *
 *  Display the song that is currently playing on your spotify
 */

(function($){
    "use strict";

    $.spotify = function(el, options) {
        var base = this;

        base.lastFMTrack = {
            title: '',
            artist: '',
            album: ''
        };

        base.$el = $(el);
        base.el = el;

        base.$el.data("spotify", base);

        base.init = function() {
            base.options = $.extend({},$.spotify.defaultOptions, options);

            if(!base.options.username) {
                base.$el.append('<p>You need to supply username.</p>')
                return;
            } else if(!base.options.api_key) {
                base.$el.append('<p>You need to supply an API key.</p>')
                return;
            }

            // Initialize the things
            base.queryLastFM();
        };

        // Get the most recently scrobbled track from LastFM
        base.queryLastFM = function() {
            $.ajax({
                type: 'GET',
                url: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+base.options.username+'&api_key='+base.options.api_key+'&limit=1&format=json',
                dataType: 'json',
                error: function() {
                    console.log('Unable to get track information from LastFM.');
                },
                success: function(data) {
                    var single_track;

                    if(data.recenttracks.track[0]) {
                        single_track = data.recenttracks.track[0];
                    } else {
                        single_track = data.recenttracks.track;
                    }

                    base.lastFMTrack.title = single_track.name;
                    base.lastFMTrack.artist = single_track.artist['#text'];
                    base.lastFMTrack.album = single_track.album['#text'];

                    // Get track information from Spotify
                    base.searchSpotify(base.lastFMTrack);
                }
            });
        }

        // Get track information from Spotify
        base.searchSpotify = function(track) {
            var searchQuery = '';

            $.each( track, function( key, value ) {
                if(value) {
                    searchQuery += key+':'+value+' ';
                }
            });

            $.ajax({
                type: 'GET',
                url: 'https://api.spotify.com/v1/search?query='+encodeURIComponent(searchQuery)+'&offset=0&limit=1&type=track',
                dataType: 'json',
                error: function() {
                    console.log('Unable to get track information from Spotify.');
                },
                success: function(data) {
                    if(data.tracks.items[0]) {
                        var item = data.tracks.items[0];
                        base.$el.append('<iframe src="https://embed.spotify.com/?uri='+encodeURIComponent(item.uri)+'" width="'+base.options.width+'" height="'+base.options.height+'" frameborder="0" allowtransparency="true"></iframe>');
                    } else {
                        console.log('No matching tracks were found on Spotify.');
                    }
                }
            });
        }

        // Run init
        base.init();
    };

    $.spotify.defaultOptions = {
        width: 300,
        height: 400,
        username: '',
        api_key: ''
    };

    $.fn.spotify = function(options) {
        return this.each(function() {
            (new $.spotify(this, options));
        });
    };

})(jQuery);