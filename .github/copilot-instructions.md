# Music Player - AI Coding Agent Instructions

## Project Overview

React + Vite music player application with React Router navigation. Core functionality: play audio tracks, display song list, and manage playlists (in progress).

## Architecture

### Component Structure

-   **App.jsx**: Main router shell with two layout sections - player (persistent) and content (routed)
-   **MusicPlayer.jsx**: Audio playback control + progress bar (in development - missing play/pause/next logic)
-   **AllSongs.jsx**: Song grid display, delegates playback to shared state
-   **Playlists.jsx**: Stub component (not yet implemented)

### State Management Pattern

**Single custom hook: `useMusic()`** (src/hooks/useMusic.js)

-   Manages all audio state: current track, playlist, playback time, duration
-   Hardcoded song list (songs array with id, title, artist, url, duration)
-   Returns: allSongs, currentTrack, currentTrackIndex, handlePlaySong, currentTime, setCurrentTime, duration, setDuration, formatTime
-   **Critical issue**: Multiple components call this hook independently, creating separate state instances - NOT shared across components. This will break playback sync when adding state updates.

### Audio Handling

-   Uses HTML5 `<audio>` ref in MusicPlayer via useRef
-   Listens to 'loadedmetadata' event to capture real audio duration
-   TODO: Implement 'timeupdate' and 'ended' event handlers (event listeners defined but no logic)
-   Songs loaded from `/public/songs/` directory as WAV files

## Developer Workflows

### Setup & Running

```bash
npm install          # Install dependencies (React 19, React Router 7, Vite)
npm run dev          # Start Vite dev server with HMR (port 5173 default)
npm run build        # Production build to dist/
npm run lint         # ESLint check (configured in eslint.config.js)
npm run preview      # Local preview of production build
```

### Build Configuration

-   **Build tool**: Vite 7 with React plugin (@vitejs/plugin-react) for Fast Refresh
-   **React Router**: BrowserRouter wraps App for client-side routing
-   **No TypeScript**: Pure JS/JSX project (no tsconfig.json)
-   **Public assets**: Songs in `public/songs/` - referenced as `/songs/filename` in src

## Key Patterns & Conventions

### State Sharing Problem

-   `useMusic()` hook is called by multiple independent components (MusicPlayer, AllSongs)
-   Each component gets its own state instance - changes in one don't affect others
-   **Solution needed**: Lift state to App.jsx OR create context provider for true shared state
-   Currently works because AllSongs only reads/dispatches, but will break when MusicPlayer adds state updates

### Song Object Structure

```javascript
{ id, title, artist, url: "/songs/filename.wav", duration: "M:SS" }
```

-   Duration in song object is for display only (string)
-   Real duration comes from audio.duration (number, in seconds)

### Component-Hook Coupling

-   Every component that needs song data must call `useMusic()` directly
-   No props drilling - hook usage is the pattern here (before context migration)

## Common Workflows & Commands

### Playing a Song

1. AllSongs calls `handlePlaySong(song, index)` on click
2. Hook updates currentTrack & currentTrackIndex
3. MusicPlayer re-renders with new currentTrack
4. Audio ref src updates → browser loads file

### Adding New Routes

1. Create component in src/components/
2. Import in App.jsx
3. Add `<Route path="/path" element={<Component />} />` in Routes
4. Component can call `useMusic()` for song data

## Critical TODOs Visible in Code

-   **MusicPlayer.jsx**: handleTimeUpdate, handleEnded event handlers are stubs
-   **MusicPlayer.jsx**: Missing onClick handlers for play/pause/next/previous buttons
-   **MusicPlayer.jsx**: Progress bar has no onChange handler to seek
-   **useMusic.js**: Line 68 has console.log(setAllSongs) placeholder
-   **Playlists.jsx**: Entire implementation missing

## Testing & Debugging

-   No test suite configured (no Jest/Vitest setup)
-   ESLint enabled but not enforced in build
-   Vite dev server provides browser DevTools + React DevTools support
-   Audio playback issues: Check browser console for CORS errors (crossOrigin='anonymous' already set)
