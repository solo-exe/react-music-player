import { useEffect } from 'react'
import { useRef } from 'react'
import { useMusic } from '../contexts'

const MusicPlayer = () => {

    const {
        currentTrack,
        volume,
        currentTime,
        duration,
        isPlaying,
        formatTime,
        setDuration,
        setCurrentTime,
        nextTrack,
        prevTrack,
        pause,
        play,
        setVolume
    } = useMusic()
    const audioRef = useRef(null);

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
    }

    const handleTimeChange = (event) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = event.target.value;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    }

    // Effect for handling PLAY and PAUSE state changes from user interaction
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch((err) => console.error("Error playing audio:", err));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Effect for handling CHANGES to the CURRENT TRACK
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.load(); // Load the new track's URL
        audio.play().catch(err => console.error("Error auto-playing next track:", err));
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;
    }, [volume])

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Runs when metadata for the audio is loaded
        const handleLoadedMetadata = () => {
            // set the duration to the actual audio duration, not the value in the song object
            setDuration(audio.duration);
        };

        // Runs continuously as the time of the playing song changes/progresses
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            nextTrack();
        };

        console.log('RUNSZ')
        // use anevent listener
        // subscribing to an event listener is usually done within a useEffect in react
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        // audio.addEventListener('canplay', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)

        // this will run when the components unmount
        return () => {
            // you remove the event listener when a mounted component disappears from the screen
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('canplay', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [setDuration, setCurrentTime, nextTrack]);

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    const volumePercentage = volume * 100;

    return (
        <div className='music-player'>
            <audio
                ref={audioRef}
                src={currentTrack.url}
                preload='metadata' // This config is required to be able to use the handleLoadedMetadata function
                crossOrigin='anonymous'
            />

            <div className='track-info'>
                <h3 className='track-title'>{currentTrack.title}</h3>
                <p className='track-artist'>{currentTrack.artist}</p>
            </div>

            <div className="progress-container">
                <span className='time'>{formatTime(currentTime)}</span>
                <input
                    className='progress-bar'
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime || 0}
                    onChange={handleTimeChange}
                    style={{ "--progress": `${progressPercentage}%` }}
                />
                <span className='time'>{formatTime(duration)}</span>
            </div>

            <div className="controls">
                <button className="control-btn" onClick={prevTrack}>⏮</button>
                <button
                    className="control-btn play-btn"
                    onClick={() => isPlaying ? pause() : play()}>
                    {isPlaying ? "⏸" : "▶"}
                </button>

                <button className="control-btn" onClick={nextTrack}>⏭</button>
            </div>

            <div className="volume-container">
                <span className="volume-icon">🔊</span>
                <input
                    className='volume-bar'
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={handleVolumeChange}
                    value={volume}
                    style={{ "--volume": `${volumePercentage}%` }}
                />
            </div>
        </div >
    )
}

export default MusicPlayer