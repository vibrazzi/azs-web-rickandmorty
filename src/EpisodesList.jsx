import { useQuery, gql } from '@apollo/client'
import { useState, useEffect } from 'react'

const GET_EPISODES = gql`
  query GetEpisodes($name: String, $page: Int) {
    episodes(filter: { name: $name }, page: $page) {
      info {
        next
        prev
        pages
        count
      }
      results {
        id
        name
        episode
        air_date
        characters {
          id
        }
      }
    }
  }
`

function EpisodesList({
  search,
  onSelectEpisode,
  favorites = [],
  watched = [],
  onToggleFavorite,
  onToggleWatched,
  showFavorites = false,
  setIsLoading,
}) {
  const [page, setPage] = useState(1)

  // Resetar para página 1 ao buscar ou alternar favoritos
  useEffect(() => {
    setPage(1)
  }, [search, showFavorites])

  const { data, loading, error } = useQuery(GET_EPISODES, {
    variables: { name: search || undefined, page },
  })

  // Informar loading global ao App
  useEffect(() => {
    if (setIsLoading) setIsLoading(loading)
    return () => setIsLoading && setIsLoading(false)
  }, [loading, setIsLoading])

  if (loading) return null
  if (error) return <p>Erro ao carregar episódios.</p>
  if (!data?.episodes?.results?.length) return <p>Nenhum episódio encontrado.</p>

  let episodes = data.episodes.results
  if (showFavorites) {
    episodes = episodes.filter(ep => favorites.includes(ep.id))
    if (!episodes.length) return <p>Nenhum episódio favorito encontrado.</p>
  }

  return (
    <div>
      {episodes.map(ep => (
        <div
          key={ep.id}
          className={`episode-card${watched.includes(ep.id) ? ' watched' : ''}`}
          onClick={onSelectEpisode ? () => onSelectEpisode(ep.id) : undefined}
        >
          <strong>{ep.episode}</strong> - {ep.name}
          <div>Data: {ep.air_date}</div>
          <div>Personagens: {ep.characters.length}</div>
          <div className="actions">
            <button
              onClick={e => {
                e.stopPropagation()
                onToggleFavorite && onToggleFavorite(ep.id)
              }}
              style={{
                background: favorites.includes(ep.id) ? '#ffd700' : undefined,
                color: favorites.includes(ep.id) ? '#333' : undefined
              }}
            >
              {favorites.includes(ep.id) ? 'Desfavoritar' : 'Favoritar'}
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onToggleWatched && onToggleWatched(ep.id)
              }}
              style={{
                background: watched.includes(ep.id) ? '#4caf50' : undefined,
                color: watched.includes(ep.id) ? '#fff' : undefined
              }}
            >
              {watched.includes(ep.id) ? 'Visto' : 'Marcar como visto'}
            </button>
          </div>
        </div>
      ))}
      {!showFavorites && data.episodes.info && (
        <div style={{ margin: '24px 0', display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!data.episodes.info.prev}
          >
            Página anterior
          </button>
          <span style={{ alignSelf: 'center' }}>
            Página {page} de {data.episodes.info.pages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!data.episodes.info.next}
          >
            Próxima página
          </button>
        </div>
      )}
    </div>
  )
}

export default EpisodesList
