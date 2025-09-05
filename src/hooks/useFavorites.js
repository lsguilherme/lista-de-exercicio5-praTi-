import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('movieFavorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const toggleFavorite = (movie) => {
    const newFavorites = favorites.some(fav => fav.id === movie.id)
      ? favorites.filter(fav => fav.id !== movie.id)
      : [...favorites, movie]
    
    setFavorites(newFavorites)
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites))
  }

  const isFavorite = (movieId) => favorites.some(fav => fav.id === movieId)

  return { favorites, toggleFavorite, isFavorite }
}