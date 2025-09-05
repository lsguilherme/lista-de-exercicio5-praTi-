import { getImageUrl } from '../services/tmdbApi'

function MovieCard({ movie, onDetailsClick, onFavoriteClick, isFavorite }) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'

  return (
    <div className="movie-card">
      <button 
        className="favorite-btn" 
        onClick={() => onFavoriteClick(movie)}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      <img 
        src={movie.poster_path ? getImageUrl(movie.poster_path) : '/placeholder.jpg'} 
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="year">{year}</p>
        <button className="details-btn" onClick={() => onDetailsClick(movie.id)}>Ver Detalhes</button>
      </div>
    </div>
  )
}

export default MovieCard