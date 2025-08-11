const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';
const seriesContainer = document.getElementById('series-container');
const categoriasContainer = document.getElementById('categorias-container');

// Modal
const modal = document.getElementById('popup-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalTypeRating = document.getElementById('modal-type-rating');
const modalOverview = document.getElementById('modal-overview');
const moreInfoBtn = document.getElementById('modal-more-info-btn');


// Función para cargar películas populares
async function cargarSeries() {
  try {
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=es-ES&page=1`
    );
    const datos = await respuesta.json();

    mostrarSeries(datos.results);
  } catch (error) {
    console.error('Error al cargar las series:', error);
    seriesContainer.innerHTML = '<p>No se pudieron cargar las series.</p>';
  }
}

const categoriasSeries = {
  "Acción y aventura": 10759,
  Comedia: 35,
  Drama: 18,
  Misterio: 9648,
  Romance: 10749,
  Animación: 16
};


// Función para mostrar las películas en el DOM
function mostrarSeries(series) {
  seriesContainer.innerHTML = '';

  series.forEach((serie) => {
    const div = document.createElement('div');
    div.classList.add('pelicula-card');

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${serie.poster_path}" alt="${serie.name}" />
      <h3 class="nombre-pelicula">${serie.name}</h3>
      <p class="entrega-pelicula">Entrega</p>
      <p class="fecha">${serie.first_air_date}</p>
    `;

    div.addEventListener('click', () => {
      openModal(serie);
    });

    seriesContainer.appendChild(div);
  });
}

// Categorias
async function cargarSeriesPorCategorias() {
  for (const [nombre, idGenero] of Object.entries(categoriasSeries)) {
    try {
      const respuesta = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=es-ES&with_genres=${idGenero}`
      );
      const datos = await respuesta.json();

      mostrarCategoria(nombre, datos.results);
    } catch (error) {
      console.error(`Error al cargar categoría ${nombre}:`, error);
    }
  }
}
function mostrarCategoria(nombre, items) {
  const seccion = document.createElement('section');
  seccion.classList.add('categoria-section');

  const titulo = document.createElement('h3');
  titulo.textContent = nombre;
  seccion.appendChild(titulo);
  titulo.classList.add('nombre-categoria');

  const contenedor = document.createElement('div');
  contenedor.classList.add('categoria-container');

  items.slice(0, 10).forEach(item => {
    const nombreItem = item.title || item.name;
    
    const div = document.createElement('div');
    div.classList.add('pelicula-card');
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${nombreItem}" />
      <h4 class="nombre-pelicula">${nombreItem}</h4>
    `;
    div.addEventListener('click', () => {
      openModal(item);
    });
    contenedor.appendChild(div);
  });

  seccion.appendChild(contenedor);
  categoriasContainer.appendChild(seccion);
}

// Modal
function openModal(item) {
  modalImg.src = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
  modalTitle.textContent = item.title || item.name;
  modalTypeRating.textContent = `${item.media_type === 'tv' ? 'Serie' : 'Película'} | ⭐ ${item.vote_average}`;
  modalOverview.textContent = item.overview || 'Sin sinopsis disponible';
  moreInfoBtn.dataset.id = item.id;
  moreInfoBtn.dataset.type = item.media_type || 'tv'; // <-- fuerza "tv" si no viene

  modalOverview.classList.add('sinopsis');
  modalTitle.classList.add('title-movie');
  modal.classList.remove('hidden');
}
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});
moreInfoBtn.addEventListener('click', () => {
  const id = moreInfoBtn.dataset.id;
  const type = moreInfoBtn.dataset.type || 'movie';
  window.location.href = `details.html?id=${id}&type=${type}&from=series`;
});

// Ejecutar la función al cargar
document.addEventListener('DOMContentLoaded', () => {
  cargarSeries();
  cargarSeriesPorCategorias();
});
