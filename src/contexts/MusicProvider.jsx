import { useState, useCallback } from "react";
import { MusicContext } from ".";
import { songs } from "./songData";
import { useEffect } from "react";


export const MusicProvider = ({ children }) => {

    const [allSongs, _setAllSongs] = useState(songs);
    const [currentTrack, setCurrentTrack] = useState(songs[0]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.08);

    const [playlists, setPlaylists] = useState(() => {
        try {
            const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
            return savedPlaylists ? JSON.parse(savedPlaylists) : [];
        } catch (error) {
            console.error("Could not load playlists from local storage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
        } catch (error) {
            console.error("Could not save playlists to local storage", error);
        }
    }, [playlists]);

    const play = () => setIsPlaying(true)
    const pause = () => setIsPlaying(false);

    const handlePlaySong = useCallback((song, index, doubleClick = false) => {
        setCurrentTrack(song);
        setCurrentTrackIndex(index);
        setIsPlaying(doubleClick)
    }, []);

    const nextTrack = useCallback(() => {
        setCurrentTrackIndex((prev => {
            const nextIndex = (prev + 1) % allSongs.length;
            setCurrentTrack(allSongs[nextIndex])
            return nextIndex;
        }));
        isPlaying ? play() : pause();
    }, [allSongs, isPlaying]);

    const prevTrack = useCallback(() => {
        setCurrentTrackIndex((prev => {
            const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
            setCurrentTrack(allSongs[nextIndex])
            return nextIndex;
        }));
        isPlaying ? play() : pause();
    }, [allSongs, isPlaying]);

    const createPlaylist = useCallback((name) => {
        if (playlists.some((playlist) => playlist.name === name)) {
            alert("Playlist with this name already exists");
            return;
        };
        const newPlaylist = { id: Date.now(), name, songs: [], }
        setPlaylists((prev) => [...prev, newPlaylist])
    }, [playlists]);

    const deletePlaylist = (playlistId) => {
        setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId))
    }

    const addSongToPlaylist = (playlistId, song) => {
        setPlaylists((prev) => prev.map(playlist => {
            if (playlist.id === playlistId) {
                return { ...playlist, songs: [...playlist.songs, song] }
            } else return playlist;
        }))
    }

    const formatTime = useCallback((time) => {
        if (isNaN(time) || !time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }, []);

    return <MusicContext.Provider value={{
        allSongs,
        currentTrackIndex,
        currentTrack,
        currentTime,
        duration,
        isPlaying,
        volume,
        playlists,
        setCurrentTime,
        setDuration,
        setVolume,
        handlePlaySong,
        formatTime,
        nextTrack,
        prevTrack,
        play,
        pause,
        createPlaylist,
        addSongToPlaylist,
        deletePlaylist
    }}>
        {children}
    </MusicContext.Provider>
}