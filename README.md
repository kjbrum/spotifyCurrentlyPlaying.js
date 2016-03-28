# ![spotifyCurrentlyPlaying.js](https://raw.githubusercontent.com/kjbrum/spotifyCurrentlyPlaying.js/master/media/spotify-currently-playing.png)


> Display your currently playing Spotify song(s) using Last.fm scrobbling.


## Documentation

http://kylebrumm.com/spotifyCurrentlyPlaying.js/


## To-Do

- [x] Fix issue with tracks being in the wrong order
- [ ] Add Methods
    - [ ] `refresh()` - Refresh the player
    - [ ] `destroy()` - Remove the player
- [ ] Add Events
    - [ ] - `init` - Fires after SCP initializes for the first time
    - [ ] - `reInit` - Fires every time SCP re-initializes
- [ ] Turn into a Bower package
- [ ] Turn into an Npm package


## Settings

|Option|Type|Default|Description|
|---|---|---|---|
selector|string\|element|'.scp-container'|Class or selector for the container
username|string|''|LastFM username
api_key|string|''|LastFM API key
width|int|300|Width of the player
height|int|400|Height of the player
theme|string|'black'|Theme of the player (black, white)
view|string|'list'|View of the player (list, coverart)
count|int|1|Number of tracks to display
backup_ids|array|[...]|Backup IDs of tracks to display if no tracks are found


## Browser Support

- Chrome _(todo)_
- Firefox _(todo)_
- Safari _(todo)_
- Opera _(todo)_
- IE _(todo)_


## Changelog

- v0.3.1
    - Add a "count" parameter to allow displaying multiple recently played songs
    - Add the "backup_ids" functionality (it actually does something now)
- v0.3.0
    - Pass an object to the function instead of multiple parameters for the settings
- v0.2.0
    - Add a "theme" parameter to switch between dark and light _(large & multiple tracks only)_
    - Add a "view" parameter to switch between list and coverart _(large & multiple tracks only)_
    - Add `backup_id` parameter to display when a track isn't found
- v0.1.0
    - Initial release

## License

Copyright © [Kyle Brumm](http://kylebrumm.com). spotifyCurrentlyPlaying.js is free to use on whatever and may be redistributed under the terms specified in the [license](LICENSE.md).
