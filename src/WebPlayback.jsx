import React, { useState, useEffect, useRef } from 'react';
import ColorThief from 'colorthief';


const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [isLoaded, setIsLoaded] = useState(false);
    const [albumColors, setAlbumColors] = useState([]);

    const coverImage = useRef(null);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    /*
    useEffect(() => {
        setIsLoaded(false);
        if (coverImage.current.complete) {
          setIsLoaded(true);
        }
    }, [current_track]);
    */

    const handleImageLoad = () => {
        setIsLoaded(true);
        console.log("Loaded")
        if(current_track.album.images[0].url){
            const colorThief = new ColorThief();
            const img = coverImage.current;
          
            console.log(current_track.album.images[0].url);
            if (img.complete) {
                console.log(colorThief.getPalette(img));
                document.body.style.backgroundColor = `rgb(${colorThief.getColor(img).join(',')})`;
              } else {
                image.addEventListener('load', function() {
                    colorThief.getColor(img).then((color) => {
                        console.log(colorThief.getPalette(img));
                        document.body.style.backgroundColor = `rgb(${colorThief.getColor(img).join(',')})`;
                    });
                });
              }
        }
    };

    /*
    useEffect(() => {
        if(current_track.album.images[0].url){
            const colorThief = new ColorThief();
            const img = coverImage.current;
          
            console.log(current_track.album.images[0].url);
            if (img.complete) {
                colorThief.getColor(img);
              } else {
                image.addEventListener('load', function() {
                  colorThief.getColor(img);
                });
              }
        }
      }, [current_track]);
      */
      

      /*
      useEffect(() => {
        document.body.style.backgroundColor = `rgb(${albumColors.join(',')})`;
      }, [albumColors]);
      */

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img ref={coverImage} src={current_track.album.images[0].url} className="now-playing__cover" alt="" crossOrigin='anonymous' onLoad={handleImageLoad}/>

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback
