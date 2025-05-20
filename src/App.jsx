import { useState, useEffect } from 'react'
import './App.css'
import EpisodesList from './EpisodesList'
import EpisodeDetail from './EpisodeDetail'

function App() {
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
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  const toggleFavorite = (id) => {
    setFavorites(favs =>
      favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    )
  }

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
            fontFamily: "var(--font-title)",
            color: "var(--color-secondary)",
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
                className="rick-icon"
                style={{
                  width: 38,
                  height: 38,
                  marginTop: 2,
                  filter: 'drop-shadow(0 0 8px #39ff14cc)'
                }}
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
                className="morty-icon"
                style={{
                  width: 38,
                  height: 38,
                  marginTop: 2,
                  filter: 'drop-shadow(0 0 8px #39ff14cc)'
                }}
              />
            </span>
          </span>
        </h1>
        <div style={{ marginBottom: 18, fontSize: '1.1em', display: 'flex', gap: 24, justifyContent: 'center' }}>
          <span style={{ marginRight: 24 }}>
            ⭐ Favoritos: <strong>{favorites.length}</strong>
          </span>
          <span>
            👁️ Vistos: <strong>{watched.length}</strong>
          </span>
        </div>
        <div style={{ marginBottom: 18, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              padding: '0.6em 1.4em'
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
          style={{ marginBottom: 18, marginTop: 6 }}
        />
        <nav style={{ marginBottom: 0, display: 'flex', gap: 8, justifyContent: 'center', flexDirection: 'row' }}>
          <button
            onClick={() => setShowFavorites(false)}
            className={!showFavorites ? 'active' : ''}
            disabled={!showFavorites}
          >
            Episódios
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={showFavorites ? 'active' : ''}
            disabled={showFavorites || favorites.length === 0}
            title={favorites.length === 0 ? 'Nenhum favorito' : undefined}
          >
            Favoritos
            {favorites.length > 0 && (
              <span style={{
                background: 'var(--color-favorite-bg)',
                color: 'var(--color-text-dark)',
                borderRadius: '50%',
                fontSize: 13,
                fontWeight: 'bold',
                padding: '2px 7px',
                marginLeft: 8,
                position: 'relative',
                top: -2
              }}>
                {favorites.length}
              </span>
            )}
          </button>
        </nav>
        {!showFavorites && (
          <div style={{ margin: '8px 0 0 0', display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'active' : ''}
            >
              Todos status
            </button>
            <button
              onClick={() => setStatusFilter('watched')}
              className={statusFilter === 'watched' ? 'active' : ''}
            >
              Vistos
            </button>
            <button
              onClick={() => setStatusFilter('unwatched')}
              className={statusFilter === 'unwatched' ? 'active' : ''}
            >
              Não vistos
            </button>
          </div>
        )}
      </header>
      <main>
        <div style={{ marginTop: 18 }} />
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
