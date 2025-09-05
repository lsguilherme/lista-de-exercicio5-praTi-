import { useState, useEffect } from 'react'
import { tmdbApi } from './services/tmdbApi'
import MovieCard from './components/MovieCard'
import MovieDetails from './components/MovieDetails'
import { useFavorites } from './hooks/useFavorites'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    loadPopularMovies()
  }, [])

  const loadPopularMovies = async (page = 1) => {
    try {
      setLoading(true)
      const response = await tmdbApi.getPopularMovies(page)
      setMovies(response.data.results.slice(0, 15))
      setTotalPages(response.data.total_pages)
      setCurrentPage(page)
    } catch (err) {
      setError('Erro ao carregar filmes')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      loadPopularMovies(1)
      return
    }

    try {
      setLoading(true)
      const response = await tmdbApi.searchMovies(searchTerm, 1)
      setMovies(response.data.results.slice(0, 15))
      setTotalPages(response.data.total_pages)
      setCurrentPage(1)
    } catch (err) {
      setError('Erro ao buscar filmes')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    if (searchTerm.trim()) {
      searchMovies(page)
    } else {
      loadPopularMovies(page)
    }
  }

  const searchMovies = async (page) => {
    try {
      setLoading(true)
      const response = await tmdbApi.searchMovies(searchTerm, page)
      setMovies(response.data.results.slice(0, 15))
      setTotalPages(response.data.total_pages)
      setCurrentPage(page)
    } catch (err) {
      setError('Erro ao buscar filmes')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Carregando filmes...</p>
    </div>
  )
  
  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Tentar Novamente</button>
    </div>
  )

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 API Filmes</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Buscar</button>
        </form>
      </header>

      <main className="main">
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onDetailsClick={setSelectedMovieId}
              onFavoriteClick={toggleFavorite}
              isFavorite={isFavorite(movie.id)}
            />
          ))}
        </div>
        
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      </main>
      
      {selectedMovieId && (
        <MovieDetails 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)} 
        />
      )}
    </div>
  )
}

export default App
