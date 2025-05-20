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
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'watched' | 'unwatched'

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
        <div className="loading-overlay">
          <div className="loading-box">
            <span className="loading-spinner"></span>
            Carregando...
          </div>
        </div>
      )}
      <header>
        <h1
          style={{
            fontFamily: "'Luckiest Guy', 'Comic Sans MS', cursive, sans-serif",
            color: '#b8fff9',
            letterSpacing: '2px',
            textShadow: '2px 4px 4px #000, 0 0 16px #b8fff9cc',
            fontSize: '2em',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 0,
            flexDirection: 'row',
            flexWrap: 'wrap',
            position: 'relative'
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            Rick
            <span className="rick-morty-icon-wrapper">
              <img
                src="rick-icon.svg"
                alt="Ícone do Rick"
                style={{
                  width: 38,
                  height: 38,
                  marginTop: 2,
                  filter: 'drop-shadow(0 0 8px #39ff14cc)'
                }}
                className="rick-icon"
              />
            </span>
          </span>
          <span style={{ margin: '0 8px' }}>and</span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            Morty
            <span className="rick-morty-icon-wrapper">
              <img
                src="morty-icon.svg"
                alt="Ícone do Morty"
                style={{
                  width: 38,
                  height: 38,
                  marginTop: 2,
                  filter: 'drop-shadow(0 0 8px #39ff14cc)'
                }}
                className="morty-icon"
              />
            </span>
          </span>
        </h1>
        <div style={{ marginBottom: 12, fontSize: '1.1em' }}>
          <span style={{ marginRight: 16 }}>
            ⭐ Favoritos: <strong>{favorites.length}</strong>
          </span>
          <span>
            👁️ Vistos: <strong>{watched.length}</strong>
          </span>
        </div>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
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
        {!showFavorites && (
          <div style={{ margin: '8px 0', display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{ fontWeight: statusFilter === 'all' ? 'bold' : 'normal' }}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('watched')}
              style={{ fontWeight: statusFilter === 'watched' ? 'bold' : 'normal' }}
            >
              Vistos
            </button>
            <button
              onClick={() => setStatusFilter('unwatched')}
              style={{ fontWeight: statusFilter === 'unwatched' ? 'bold' : 'normal' }}
            >
              Não vistos
            </button>
          </div>
        )}
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
            statusFilter={statusFilter}
          />
        )}
      </main>
    </>
  )
}

export default App
