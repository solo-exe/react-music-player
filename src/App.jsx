import './App.css'
import AllSongs from './components/AllSongs'
import MusicPlayer from './components/MusicPlayer'
import { Routes, Route } from 'react-router'
import Playlists from './components/Playlists'
import { BrowserRouter } from 'react-router'
import { MusicProvider } from './contexts/MusicProvider'
import NavBar from './components/NavBar'


function App() {

  return (
    <BrowserRouter>
      <MusicProvider>
        <div className='app'>
          <NavBar />
          <main className='app-main'>
            {/* <div className="player-section"> */}
            <MusicPlayer />
            {/* </div> */}

            <div className="content-section">
              <Routes>
                <Route path='/' element={<AllSongs />} />
                <Route path='/playlists' element={<Playlists />} />
              </Routes>
            </div>
          </main>
        </div>
      </MusicProvider>
    </BrowserRouter>
  )
}

export default App
