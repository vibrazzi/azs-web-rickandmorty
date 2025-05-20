import { useState, useEffect } from 'react'
import './App.css'
import EpisodesList from './EpisodesList'
import EpisodeDetail from './EpisodeDetail'

function App() {
  // Carregar favoritos e vistos do localStorage ao iniciar
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || []
    } catch {
      return []
    }
  })
  const [watched, setWatched] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('watched')) || []
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // Salvar vistos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  // Favoritar/desfavoritar episódio
  const toggleFavorite = (id) => {
    setFavorites(favs =>
      favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    )
  }

  // Marcar/desmarcar como visto
  const toggleWatched = (id) => {
    setWatched(watched =>
      watched.includes(id) ? watched.filter(w => w !== id) : [...watched, id]
    )
  }

  return (
    <>
      <header>
        <h1>AZShip - Rick and Morty Episódios</h1>
        <div style={{ marginBottom: 12, fontSize: '1.1em' }}>
          <span style={{ marginRight: 16 }}>
            ⭐ Favoritos: <strong>{favorites.length}</strong>
          </span>
          <span>
            👁️ Vistos: <strong>{watched.length}</strong>
          </span>
        </div>
        <input
          type="text"
          placeholder="Buscar episódio pelo nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <nav>
          <button
            onClick={() => setShowFavorites(false)}
            style={{ fontWeight: !showFavorites ? 'bold' : 'normal' }}
          >
            Todos Episódios
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            style={{ fontWeight: showFavorites ? 'bold' : 'normal' }}
          >
            Favoritos
          </button>
        </nav>
      </header>
      <main>
        {selectedEpisodeId ? (
          <EpisodeDetail
            episodeId={selectedEpisodeId}
            onBack={() => setSelectedEpisodeId(null)}
            favorites={favorites}
            watched={watched}
            onToggleFavorite={toggleFavorite}
            onToggleWatched={toggleWatched}
          />
        ) : (
          <EpisodesList
            search={search}
            onSelectEpisode={setSelectedEpisodeId}
            favorites={favorites}
            watched={watched}
            onToggleFavorite={toggleFavorite}
            onToggleWatched={toggleWatched}
            showFavorites={showFavorites}
          />
        )}
      </main>
    </>
  )
}

export default App
