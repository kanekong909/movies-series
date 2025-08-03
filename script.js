const apiKey = "c430c77d8b25dc96309ce5d466d3c372";
const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');
const hoverModal = document.getElementById('hover-modal');

// Modal
const modal = document.getElementById('popup-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalTypeRating = document.getElementById('modal-type-rating');
const modalOverview = document.getElementById('modal-overview');
const moreInfoBtn = document.getElementById('modal-more-info-btn');


// Renderizar las peliculas buscadas
function renderResults(items) {
  const moviesContainer = document.getElementById('movies-container');
  const seriesContainer = document.getElementById('series-container');
  
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

    // 👉 Evento para abrir modal al hacer click en la tarjeta
    div.addEventListener('click', () => {
      openModal(item);
    });

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

// Recomendadas
async function loadRecommendedContent() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&sort_by=popularity.desc`);
    const data = await res.json();
    const recomendados = data.results.slice(0, 10);

    const contenedor = document.getElementById('recomendados-container');
    contenedor.innerHTML = recomendados.map(item => `
      <div class="card-recomendado" onclick="redirigirADetalles('${item.id}', 'movie')">
        <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.title}">
        <p>${item.title}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar recomendados:', error);
  }
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

// Modal
function openModal(item) {
  modalImg.src = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
  modalTitle.textContent = item.title || item.name;
  modalTypeRating.textContent = `${item.media_type === 'movie' ? 'Película' : 'Serie'} | ⭐ ${item.vote_average}`;
  modalOverview.textContent = item.overview || 'Sin sinopsis disponible';
  moreInfoBtn.dataset.id = item.id;
  moreInfoBtn.dataset.type = item.media_type;

  // Clases añadidas
  modalOverview.classList.add('sinopsis'); // Sinopsis
  modalTitle.classList.add('title-movie')

  modal.classList.remove('hidden');
}

// Cerrar modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Cerrar al hacer clic fuera del modal
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Ir a detalles
moreInfoBtn.addEventListener('click', () => {
  const id = moreInfoBtn.dataset.id;
  const type = moreInfoBtn.dataset.type;
  window.location.href = `templates/details.html?id=${id}&type=${type}`;
});

// Llamar a la funcion cargar por defecto las peliculas cuando se carga la pagina
window.addEventListener('DOMContentLoaded', () => {
  loadDefaultMovies();
  loadRecommendedContent();
});
