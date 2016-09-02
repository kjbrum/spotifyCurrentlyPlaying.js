# ![spotifyCurrentlyPlaying.js](https://raw.githubusercontent.com/kjbrum/spotifyCurrentlyPlaying.js/master/img/spotify-currently-playing.png)

> Display your currently playing Spotify song(s) using Last.fm scrobbling.


## Documentation

http://kylebrumm.com/spotifyCurrentlyPlaying.js/


## Install

__Bower:__

```
$ bower install spotifyCurrentlyPlaying.js
```

__npm:__

```
$ npm install spotifyCurrentlyPlaying.js
```

__CDN:__

```
<script src="https://unpkg.com/spotifyCurrentlyPlaying.js/dist/spotifyCurrentlyPlaying.min.js"></script>
```


## To-Do

- [ ] Add Methods
    - [ ] `refresh()` - Refresh the player
    - [ ] `destroy()` - Remove the player
- [ ] Add Events
    - [ ] - `init` - Fires after SCP initializes for the first time
    - [ ] - `reInit` - Fires every time SCP re-initializes
- Website
    - [ ] Add a table of all the "options"
    - [ ] Add a "Browser Support" section


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


## License

Copyright &copy; [Kyle Brumm](http://kylebrumm.com). spotifyCurrentlyPlaying.js is free to use on whatever and may be redistributed under the terms specified in the [license](LICENSE.md).
