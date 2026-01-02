# React Music Player

A clean, modern, and functional music player application built with React. This project demonstrates core React concepts, state management with the Context API, and direct DOM manipulation for controlling HTML5 audio.

## Features

-   **Standard Playback Controls**: Play, pause, next track, and previous track.
-   **Track Progress**: A visual progress bar that shows the current timestamp and total duration.
-   **Seek Functionality**: Click or drag the progress bar to seek to a specific point in the track.
-   **Volume Control**: Adjust the playback volume with a dedicated slider.
-   **Playlist Management**:
    -   Create new playlists.
    -   Add songs to any playlist.
    -   Delete playlists.
-   **Data Persistence**: Playlists are saved to the browser's `localStorage`, so they persist between sessions.
-   **Automatic Playback**: The next track automatically starts when the current one ends.

## Tech Stack & Key Concepts

This application is architected using a modern frontend stack, emphasizing best practices in React development, including advanced hooks and patterns, alongside powerful browser APIs. The entire development and production lifecycle is containerized with Docker, ensuring consistent, reproducible environments and simplifying deployment.

### Core Technologies

-   **React**: The core UI library for building the component-based interface.
-   **Vite**: A next-generation frontend tooling that provides a faster and leaner development experience.
-   **HTML5 `<audio>` Element**: Used for all audio playback functionality.
-   **CSS**: Custom styling for the player, including dynamic progress and volume bars using CSS Custom Properties.

### React Hooks & Patterns

-   **`useState`**: For managing local component state and the application's global state within the context.
    -   **Lazy Initialization**: The `playlists` state is initialized from `localStorage` using the `useState(() => ...)` functional update form to ensure it only runs once on the initial render.
-   **`useContext` (`MusicContext`)**: Provides a global state management solution, making state like the current track, playlists, and playback status available throughout the component tree without prop drilling.
-   **`useEffect`**: For handling side effects, such as:
    -   Interacting with the HTML5 `<audio>` element (playing, pausing, changing volume).
    -   Subscribing and unsubscribing to audio events (`timeupdate`, `loadedmetadata`, `ended`).
    -   Syncing the `playlists` state to `localStorage` whenever it changes.
-   **`useRef`**: To get a direct reference to the `<audio>` DOM element, allowing for imperative control (e.g., `audioRef.current.play()`).
-   **`useCallback`**: To memoize functions, preventing unnecessary re-renders of child components and optimizing performance, especially for functions passed down through context.

### Browser APIs

-   **`localStorage` API**: Used to persist user-created playlists, providing a seamless experience across browser sessions.

### Styling

-   **CSS Custom Properties (Variables)**: The progress bar and volume slider are dynamically updated by setting CSS variables (`--progress`, `--volume`) from React state, allowing for efficient and smooth UI updates.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/your_username/music-player.git
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Run the development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).
