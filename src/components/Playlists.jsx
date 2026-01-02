import { useState } from 'react'
import { useMusic } from '../contexts';

const Playlists = () => {

    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { playlists, createPlaylist, allSongs, addSongToPlaylist, deletePlaylist, currentTrackIndex, handlePlaySong } = useMusic();

    const filteredSongs = allSongs.filter((song) => {
        const matches = (String(song.title).toLowerCase().includes(searchQuery.toLowerCase())
            || String(song.artist).toLowerCase().includes(searchQuery.toLowerCase()))
        const isAlreadyInPlaylist = selectedPlaylist?.songs.some((playlistSong) => playlistSong.id === song.id);
        return (matches && !isAlreadyInPlaylist)
    })

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName("");
        }
    }

    const handleAddSong = (song) => {
        if (selectedPlaylist) {
            addSongToPlaylist(selectedPlaylist.id, song);
            setSearchQuery("");
            setShowDropdown(false);
        }
    }

    const handleDeletePlaylist = (playlistToDelete) => {
        if (window.confirm(`Are you sure you want to delete the "${playlistToDelete.name}" playlist?`)) {
            deletePlaylist(playlistToDelete.id);
            if (selectedPlaylist?.id === playlistToDelete.id) {
                setSelectedPlaylist(null);
                setSearchQuery("");
                setShowDropdown(false);
            }
        }
    };

    const handlePlayFromPlaylist = (song, doubleClick = false) => {
        const globalIndex = allSongs.findIndex((s) => s.id === song.id);
        handlePlaySong(song, globalIndex, doubleClick)
    }

    return (
        <div className="playlists">
            <h2>Playlists</h2>

            <div className="create-playlist">
                <h3>Create a new playlist</h3>
                <div className="playlist-form">
                    <input
                        type="text"
                        placeholder="Playlist name..."
                        className="playlist-input"
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        value={newPlaylistName}
                    />
                    <button className='create-btn' onClick={handleCreatePlaylist}>Create</button>
                </div>
            </div>

            <div className='playlists-list'>
                {
                    playlists.length === 0
                        ? (<p className='empty-message'>No playlists created yet</p>)
                        : (playlists.map((playlist) => (
                            <div className='playlist-item' key={playlist.id}>

                                <div className="playlist-header">
                                    <h3 className='playlist-title'>{playlist.name}</h3>

                                    <div className="playlist-actions">
                                        <button
                                            className='delete-playlist-btn'
                                            onClick={() => handleDeletePlaylist(playlist)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Add Song Search */}
                                <div className="add-song-section">
                                    <div className="search-container">
                                        <input
                                            type="text"
                                            placeholder="Search Songs..."
                                            value={selectedPlaylist?.id === playlist.id ? searchQuery : ""}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                if (selectedPlaylist?.id !== playlist.id) setSelectedPlaylist(playlist);
                                                setShowDropdown(e.target.value.length > 0);
                                            }}
                                            // onFocus={(e) => {
                                            //     setSelectedPlaylist(playlist);
                                            //     setShowDropdown(e.target.value.length > 0);
                                            // }}
                                            className='song-search-input'
                                        />
                                        {selectedPlaylist?.id === playlist.id && showDropdown && (
                                            <div className="song-dropdown">
                                                {filteredSongs.length === 0
                                                    ? <div className="dropdpwn-item no-results">No results found </div>
                                                    : <div className="dropdpwn-item">{filteredSongs
                                                        .slice(0, 5)
                                                        .map((song) => (
                                                            <div
                                                                key={song.id}
                                                                className="dropdown-item"
                                                                onClick={() => handleAddSong(song)}
                                                            >
                                                                <span className='song-title'>{song.title}</span>
                                                                <span className='song-artist'>{song.artist}</span>
                                                            </div>)
                                                        )}</div>
                                                }
                                            </div>
                                        )}

                                        <div className='playlist-songs'>
                                            {
                                                playlist.songs.length === 0
                                                    ? <p>No songs in this playlists</p>
                                                    : playlist.songs.map((song, key) => (
                                                        <div
                                                            key={key}
                                                            className={`playlist-song ${currentTrackIndex === allSongs.findIndex((s) => s.id === song.id) ? "active" : ""}`}
                                                            onClick={() => handlePlayFromPlaylist(song)}
                                                            onDoubleClick={() => handlePlayFromPlaylist(song, true)}
                                                        >
                                                            <div className="song-info">
                                                                <span className="song-title">{song.title}</span>
                                                                <span className="song-artist">{song.artist}</span>
                                                            </div>
                                                            <div className="song-duration">{song.duration}</div>
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )))
                }
            </div>
        </div>
    )
}

export default Playlists