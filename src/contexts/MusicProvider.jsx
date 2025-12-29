import { useState } from "react";
import { MusicContext } from ".";
import { songs } from "./songData";


export const MusicProvider = ({ children }) => {

    const [allSongs, _setAllSongs] = useState(songs);
    const [currentTrack, setCurrentTrack] = useState(songs[0]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.03);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    const handlePlaySong = (song, index, doubleClick = false) => {
        setCurrentTrack(song);
        setCurrentTrackIndex(index);

        // TEMPORARY ATTEMPT
        setIsPlaying(doubleClick)
    }

    const nextTrack = () => {
        setCurrentTrackIndex((prev => {
            const nextIndex = (prev + 1) % allSongs.length;
            setCurrentTrack(allSongs[nextIndex])
            return nextIndex;
        }));
        setIsPlaying((prev) => prev)
    }

    const prevTrack = () => {
        setCurrentTrackIndex((prev => {
            const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
            setCurrentTrack(allSongs[nextIndex])
            return nextIndex;
        }));
        setIsPlaying((prev) => prev)
    }

    const formatTime = (time) => {
        if (isNaN(time) || !time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return <MusicContext.Provider value={{
        allSongs,
        currentTrackIndex,
        currentTrack,
        currentTime,
        duration,
        isPlaying,
        volume,
        setCurrentTime,
        setDuration,
        setVolume,
        handlePlaySong,
        formatTime,
        nextTrack,
        prevTrack,
        play,
        pause,
    }}>
        {children}
    </MusicContext.Provider>
}