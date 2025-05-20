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

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os favoritos e vistos?')) {
      setFavorites([])
      setWatched([])
    }
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
        <h1 className="app-title">
          <span className="title-part">
            Rick
            <span className="rick-morty-icon-wrapper">
              <img src="rick-icon.svg" alt="Ícone do Rick" className="rick-icon" />
            </span>
          </span>
          <span className="and-text">and</span>
          <span className="title-part">
            Morty
            <span className="rick-morty-icon-wrapper">
              <img src="morty-icon.svg" alt="Ícone do Morty" className="morty-icon" />
            </span>
          </span>
        </h1>
        <div className="counters">
          <span>
            ⭐ Favoritos: <strong>{favorites.length}</strong>
          </span>
          <span>
            👁️ Vistos: <strong>{watched.length}</strong>
          </span>
        </div>
        <div className="actions-bar">
          <button onClick={handleClear} className="danger">
            Limpar favoritos e vistos
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar episódio pelo nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <nav className="main-nav">
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
              <span className="favorites-badge">{favorites.length}</span>
            )}
          </button>
        </nav>
        {!showFavorites && (
          <div className="status-filters">
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
        <div className="main-spacer" />
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
