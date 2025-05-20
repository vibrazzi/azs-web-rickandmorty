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
  const isFavorite = favorites.includes(ep.id)
  const isWatched = watched.includes(ep.id)

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 16 }}>Voltar</button>
      <h2>
        {ep.episode} - {ep.name}
        {isFavorite && (
          <span title="Favorito" style={{ marginLeft: 10, color: '#ffd700', fontSize: 28, verticalAlign: 'middle' }}>★</span>
        )}
        {isWatched && (
          <span title="Visto" style={{ marginLeft: 10, color: '#4caf50', fontSize: 22, verticalAlign: 'middle' }}>👁️</span>
        )}
      </h2>
      <div>Data: {ep.air_date}</div>
      <div style={{ margin: '12px 0' }}>
        <button
          aria-label={isFavorite ? 'Desfavoritar episódio' : 'Favoritar episódio'}
          title={isFavorite ? 'Desfavoritar episódio' : 'Favoritar episódio'}
          onClick={() => onToggleFavorite && onToggleFavorite(ep.id)}
          style={{
            marginRight: 8,
            background: isFavorite ? '#ffd700' : undefined,
            color: isFavorite ? '#333' : undefined
          }}
        >
          {isFavorite ? 'Desfavoritar' : 'Favoritar'}
        </button>
        <button
          aria-label={isWatched ? 'Marcar como não visto' : 'Marcar como visto'}
          title={isWatched ? 'Marcar como não visto' : 'Marcar como visto'}
          onClick={() => onToggleWatched && onToggleWatched(ep.id)}
          style={{
            background: isWatched ? '#4caf50' : undefined,
            color: isWatched ? '#fff' : undefined
          }}
        >
          {isWatched ? 'Visto' : 'Marcar como visto'}
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
