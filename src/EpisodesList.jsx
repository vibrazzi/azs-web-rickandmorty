import { useQuery, gql } from '@apollo/client'

const GET_EPISODES = gql`
  query GetEpisodes($name: String) {
    episodes(filter: { name: $name }) {
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
}) {
  const { data, loading, error } = useQuery(GET_EPISODES, {
    variables: { name: search || undefined },
  })

  if (loading) return <p>Carregando episódios...</p>
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
    </div>
  )
}

export default EpisodesList
