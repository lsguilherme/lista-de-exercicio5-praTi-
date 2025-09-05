import { useState, useEffect } from 'react'
import { tmdbApi, getImageUrl } from '../services/tmdbApi'

function MovieDetails({ movieId, onClose }) {
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          tmdbApi.getMovieDetails(movieId),
          tmdbApi.getMovieCredits(movieId)
        ])
        setMovie(movieResponse.data)
        setCredits(creditsResponse.data)
      } catch (err) {
        setError('Erro ao carregar detalhes do filme')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [movieId])

  if (loading) return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando detalhes...</p>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="error">
          <p>{error}</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )

  const director = credits?.crew?.find(person => person.job === 'Director')
  const cast = credits?.cast?.slice(0, 5) || []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="movie-details">
          <img 
            src={movie.poster_path ? getImageUrl(movie.poster_path) : '/placeholder.jpg'} 
            alt={movie.title}
            className="details-poster"
          />
          <div className="details-info">
            <h2>{movie.title}</h2>
            <p><strong>Diretor:</strong> {director?.name || 'N/A'}</p>
            <p><strong>Elenco:</strong> {cast.map(actor => actor.name).join(', ')}</p>
            <p><strong>Avaliação:</strong> ⭐ {movie.vote_average?.toFixed(1)}/10</p>
            <p><strong>Sinopse:</strong> {movie.overview || 'Sinopse não disponível'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails