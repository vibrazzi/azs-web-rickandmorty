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
  const [isLoading, setIsLoading] = useState(false)

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
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#222',
            padding: 32,
            borderRadius: 12,
            color: '#fff',
            fontSize: 22,
            fontWeight: 'bold',
            boxShadow: '0 2px 16px #0008'
          }}>
            Carregando...
          </div>
        </div>
      )}
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
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar todos os favoritos e vistos?')) {
                setFavorites([])
                setWatched([])
              }
            }}
            style={{
              background: '#c62828',
              color: '#fff',
              border: 'none',
              marginTop: 4,
              marginBottom: 8,
              padding: '0.4em 1em'
            }}
          >
            Limpar favoritos e vistos
          </button>
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
            setIsLoading={setIsLoading}
          />
        )}
      </main>
    </>
  )
}

export default App
