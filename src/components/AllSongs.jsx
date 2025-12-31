import { useMusic } from '../contexts';

const AllSongs = () => {

    const { allSongs, handlePlaySong, currentTrackIndex } = useMusic();

    return (
        <div className='all-songs'>
            <h2>All songs ({allSongs.length})</h2>
            <h2>Double-click on a track to play</h2>

            <div className='songs-grid '>
                {allSongs.map((song, key) => (
                    <div
                        key={key}
                        onClick={() => handlePlaySong(song, key)}
                        onDoubleClick={() => handlePlaySong(song, key, true)}
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