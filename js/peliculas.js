const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';
const peliculasContainer = document.getElementById('peliculas-container');
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
async function cargarPeliculas() {
  try {
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`
    );
    const datos = await respuesta.json();

    mostrarPeliculas(datos.results);
  } catch (error) {
    console.error('Error al cargar películas:', error);
    peliculasContainer.innerHTML = '<p>No se pudieron cargar las películas.</p>';
  }
}

const categorias = {
  Acción: 28,
  Comedia: 35,
  Drama: 18,
  Terror: 27,
  Romance: 10749,
  Animación: 16
};

// Función para mostrar las películas en el DOM
function mostrarPeliculas(peliculas) {
  peliculasContainer.innerHTML = '';

  peliculas.forEach((pelicula) => {
    const div = document.createElement('div');
    div.classList.add('pelicula-card');

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${pelicula.poster_path}" alt="${pelicula.title}" />
      <h3 class="nombre-pelicula">${pelicula.title}</h3>
      <p class="entrega-pelicula">Entrega</p>
      <p class="fecha">${pelicula.release_date}</p>
    `;

    // Puedes añadir funcionalidad para ver detalles al hacer clic
    div.addEventListener('click', () => {
      openModal(pelicula);
    });

    peliculasContainer.appendChild(div);
  });
}

// Categorias
async function cargarPeliculasPorCategorias() {
  for (const [nombre, idGenero] of Object.entries(categorias)) {
    try {
      const respuesta = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&with_genres=${idGenero}`
      );
      const datos = await respuesta.json();

      mostrarCategoria(nombre, datos.results);
    } catch (error) {
      console.error(`Error al cargar categoría ${nombre}:`, error);
    }
  }
}
function mostrarCategoria(nombre, peliculas) {
  const seccion = document.createElement('section');
  seccion.classList.add('categoria-section');

  const titulo = document.createElement('h3');
  titulo.textContent = nombre;
  seccion.appendChild(titulo);
  titulo.classList.add('nombre-categoria');

  const contenedor = document.createElement('div');
  contenedor.classList.add('categoria-container');

  peliculas.slice(0, 10).forEach(pelicula => {
    const div = document.createElement('div');
    div.classList.add('pelicula-card');
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${pelicula.poster_path}" alt="${pelicula.title}" />
      <h4 class="nombre-pelicula">${pelicula.title}</h4>
    `;
    div.addEventListener('click', () => {
        openModal(pelicula);
    });
    contenedor.appendChild(div);
  });

  seccion.appendChild(contenedor);
  categoriasContainer.appendChild(seccion);
}

// Modal
function openModal(item) {
  modalImg.src = `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`;
  modalTitle.textContent = item.title || item.name;
  modalTypeRating.textContent = `Película | ⭐ ${item.vote_average}`;
  modalOverview.textContent = item.overview || 'Sin sinopsis disponible';
  moreInfoBtn.dataset.id = item.id;

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
  window.location.href = `details.html?id=${id}&type=${type}&from=peliculas`;
});

// Ejecutar la función al cargar
document.addEventListener('DOMContentLoaded', () => {
  cargarPeliculas();
  cargarPeliculasPorCategorias();
});
