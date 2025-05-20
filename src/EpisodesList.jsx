import { useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";

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
`;

function EpisodesList({
  search,
  onSelectEpisode,
  favorites = [],
  watched = [],
  onToggleFavorite,
  onToggleWatched,
  showFavorites = false,
  statusFilter = "all",
  setIsLoading,
}) {
  const [page, setPage] = useState(1);
  const [tempWatched, setTempWatched] = useState(watched);

  useEffect(() => {
    setPage(1);
  }, [search, showFavorites, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setTempWatched(watched), 300);
    return () => clearTimeout(timer);
  }, [watched]);

  const { data, loading, error } = useQuery(GET_EPISODES, {
    variables: { name: search || undefined, page },
  });

  useEffect(() => {
    if (setIsLoading) setIsLoading(loading);
    return () => setIsLoading && setIsLoading(false);
  }, [loading, setIsLoading]);

  if (loading) return <p>Carregando episódios...</p>;
  if (error) return <p>Erro ao carregar episódios.</p>;
  if (!data?.episodes?.results?.length)
    return <p>Nenhum episódio encontrado.</p>;

  let episodes = data.episodes.results;

  if (showFavorites) {
    episodes = episodes.filter((ep) => favorites.includes(ep.id));
    if (!episodes.length) return <p>Nenhum episódio favorito encontrado.</p>;
  } else if (statusFilter === "watched") {
    episodes = episodes.filter((ep) => watched.includes(ep.id));
  } else if (statusFilter === "unwatched") {
    episodes = episodes.filter((ep) => !watched.includes(ep.id));
  }

  if (!episodes.length) return <p>Nenhum episódio encontrado.</p>;

  const handleToggleWatched = (id) => {
    onToggleWatched && onToggleWatched(id);
    setTempWatched((prev) =>
      prev.includes(id)
        ? prev.filter((watchedId) => watchedId !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      {episodes.map((ep, idx) => {
        let hidden = false;
        if (statusFilter === "watched" && !tempWatched.includes(ep.id))
          hidden = true;
        if (statusFilter === "unwatched" && tempWatched.includes(ep.id))
          hidden = true;

        return (
          <div
            key={ep.id}
            className={
              `episode-card` +
              (favorites.includes(ep.id) ? " favorited" : "") +
              (ep.characters.length >= 10 ? " popular" : "") +
              (hidden ? " hidden" : "")
            }
            style={{ "--card-delay": `${idx * 60}ms` }}
            onClick={onSelectEpisode ? () => onSelectEpisode(ep.id) : undefined}
          >
            <strong>{ep.episode}</strong> - {ep.name}
            <div>Data: {ep.air_date}</div>
            <div>
              Personagens:{" "}
              <span
                style={
                  ep.characters.length >= 10
                    ? { color: "#39ff14", fontWeight: 700 }
                    : {}
                }
              >
                {ep.characters.length}
              </span>
              {ep.characters.length >= 10 && (
                <span
                  title="Episódio popular"
                  style={{
                    marginLeft: 6,
                    color: "#39ff14",
                    fontSize: 18,
                    verticalAlign: "middle",
                  }}
                >
                  ⚡
                </span>
              )}
            </div>
            <div className="actions">
              <button
                aria-label={
                  favorites.includes(ep.id)
                    ? "Desfavoritar episódio"
                    : "Favoritar episódio"
                }
                title={
                  favorites.includes(ep.id)
                    ? "Desfavoritar episódio"
                    : "Favoritar episódio"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite && onToggleFavorite(ep.id);
                }}
                style={{
                  background: favorites.includes(ep.id) ? "#ffd700" : undefined,
                  color: favorites.includes(ep.id) ? "#333" : undefined,
                }}
              >
                {favorites.includes(ep.id) ? "Desfavoritar" : "Favoritar"}
              </button>
              {onToggleWatched && (
                <button
                  aria-label={
                    watched.includes(ep.id)
                      ? "Marcar como não visto"
                      : "Marcar como visto"
                  }
                  title={
                    watched.includes(ep.id)
                      ? "Marcar como não visto"
                      : "Marcar como visto"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWatched(ep.id);
                  }}
                  style={{
                    background: watched.includes(ep.id) ? "#4caf50" : undefined,
                    color: watched.includes(ep.id) ? "#fff" : undefined,
                  }}
                >
                  {watched.includes(ep.id) ? "Visto" : "Marcar como visto"}
                </button>
              )}
            </div>
          </div>
        );
      })}
      {!showFavorites && data.episodes.info && (
        <div
          style={{
            margin: "24px 0",
            display: "flex",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <button
            aria-label="Página anterior"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data.episodes.info.prev}
          >
            Página anterior
          </button>
          <span style={{ alignSelf: "center" }}>
            Página {page} de {data.episodes.info.pages}
          </span>
          <button
            aria-label="Próxima página"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.episodes.info.next}
          >
            Próxima página
          </button>
        </div>
      )}
    </div>
  );
}

export default EpisodesList;
