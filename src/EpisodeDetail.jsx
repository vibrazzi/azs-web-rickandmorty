import { useQuery, gql } from '@apollo/client'

const GET_EPISODE = gql`
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      id
      name
      episode
      air_date
      characters {
        id
        name
        image
        species
        status
      }
    }
  }
`

function EpisodeDetail({
  episodeId,
  onBack,
  favorites = [],
  watched = [],
  onToggleFavorite,
  onToggleWatched,
}) {
  const { data, loading, error } = useQuery(GET_EPISODE, {
    variables: { id: episodeId },
  })

  if (loading) return <p>Carregando detalhes...</p>
  if (error) return <p>Erro ao carregar detalhes.</p>
  if (!data?.episode) return <p>Episódio não encontrado.</p>

  const ep = data.episode

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 16 }}>Voltar</button>
      <h2>{ep.episode} - {ep.name}</h2>
      <div>Data: {ep.air_date}</div>
      <div style={{ margin: '12px 0' }}>
        <button
          onClick={() => onToggleFavorite && onToggleFavorite(ep.id)}
          style={{
            marginRight: 8,
            background: favorites.includes(ep.id) ? '#ffd700' : undefined,
            color: favorites.includes(ep.id) ? '#333' : undefined
          }}
        >
          {favorites.includes(ep.id) ? 'Desfavoritar' : 'Favoritar'}
        </button>
        <button
          onClick={() => onToggleWatched && onToggleWatched(ep.id)}
          style={{
            background: watched.includes(ep.id) ? '#4caf50' : undefined,
            color: watched.includes(ep.id) ? '#fff' : undefined
          }}
        >
          {watched.includes(ep.id) ? 'Visto' : 'Marcar como visto'}
        </button>
      </div>
      <h3>Personagens</h3>
      <div className="character-list">
        {ep.characters.map(char => (
          <div key={char.id} className="character-card">
            <img src={char.image} alt={char.name} />
            <div><strong>{char.name}</strong></div>
            <div>Espécie: {char.species}</div>
            <div>Status: {char.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EpisodeDetail
