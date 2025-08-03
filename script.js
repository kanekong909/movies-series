const apiKey = "c430c77d8b25dc96309ce5d466d3c372";
const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');
const hoverModal = document.getElementById('hover-modal');

// Renderizar las peliculas buscadas
function renderResults(items) {
  const moviesContainer = document.getElementById('movies-container');
  const seriesContainer = document.getElementById('series-container');
  
  // Limpiar ambos
  moviesContainer.innerHTML = "";
  seriesContainer.innerHTML = "";

  items.forEach(item => {
    if (!item.poster_path || !item.backdrop_path) return;

    const div = document.createElement('div');
    div.classList.add('movie-card');
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.title || item.name}">
      <h4 class="nombre-pelicula">${item.title || item.name}</h4>
    `;

    // Eventos para el modal flotante
    div.addEventListener('mouseenter', () => {
      const content = `
        <img src="https://image.tmdb.org/t/p/w500${item.backdrop_path}" alt="Backdrop">
        <h4>${item.title || item.name}</h4>
        <p><strong>${item.media_type === 'movie' ? 'Película' : 'Serie'}</strong> | ⭐ ${item.vote_average}</p>
        <p>${item.overview || 'Sin sinopsis disponible.'}</p>
      `;
      hoverModal.innerHTML = content;
      hoverModal.classList.remove('hidden');
    });

    div.addEventListener('mouseleave', () => {
      hoverModal.classList.add('hidden');
    });

    div.addEventListener('mousemove', (e) => {
      const modalWidth = hoverModal.offsetWidth;
      const modalHeight = hoverModal.offsetHeight;
      const padding = 15;

      let left = e.pageX + 10;
      let top = e.pageY + 10;

      if (left + modalWidth + padding > window.innerWidth) {
        left = e.pageX - modalWidth - 10;
      }
      if (top + modalHeight + padding > window.innerHeight) {
        top = e.pageY - modalHeight - 10;
      }

      hoverModal.style.left = `${left}px`;
      hoverModal.style.top = `${top}px`;
    });

    // Añadir al contenedor correcto
    if (item.media_type === 'movie') {
      moviesContainer.appendChild(div);
    } else if (item.media_type === 'tv') {
      seriesContainer.appendChild(div);
    }
  });
}

// Cargar peliculas por defecto
async function loadDefaultMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=es-ES`);
  const data = await res.json();
  renderResults(data.results);
}

// Busqueda
async function search(query) {
  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  renderResults(data.results);
}
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();

  if (query.length > 0) {
    search(query);
  } else {
    loadDefaultMovies();
  }
});

// Llamar a la funcion cargar por defecto las peliculas cuando se carga la pagina
window.addEventListener('DOMContentLoaded', () => {
  loadDefaultMovies();
});
