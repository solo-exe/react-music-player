import { useRef } from 'react';
import { useMusic } from '../contexts';

const AllSongs = () => {

    const { allSongs, handlePlaySong, currentTrackIndex } = useMusic();
    const clickTimeoutRef = useRef(null);

    const handleClick = (song, key) => {
        // If a timer is already running, it means this is a double-click
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            handlePlaySong(song, key, true); // Perform double-click action
        } else {
            // This is the first click, set a timer
            clickTimeoutRef.current = setTimeout(() => {
                clickTimeoutRef.current = null;
                handlePlaySong(song, key, false); // Perform single-click action
            }, 250); // 250ms delay to wait for a potential second click
        }
    };

    return (
        <div className='all-songs'>
            <h2>All songs ({allSongs.length})</h2>

            <div className='songs-grid '>
                {allSongs.map((song, key) => (
                    <div
                        key={key}
                        onClick={() => handleClick(song, key)}
                        className={`song-card ${currentTrackIndex === key ? "active" : ""}`}
                    >
                        <div className="song-info">
                            <h3 className='song-title'>{song.title}</h3>
                            <p className='song-artist'>{song.artist}</p>
                            <span className='song-duration'>{song.duration}</span>
                        </div>
                        <div className='play-button'>
                            {currentTrackIndex === key ? "♪" : "▶"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllSongs