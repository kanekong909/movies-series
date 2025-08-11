const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';
const directoresContainer = document.getElementById('directores-container');
const categoriasContainer = document.getElementById('categorias-container');

// Modal
const modal = document.getElementById('popup-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalTypeRating = document.getElementById('modal-type-rating');
const modalOverview = document.getElementById('modal-overview');
const moreInfoBtn = document.getElementById('modal-more-info-btn');

// Cargar solo personas que realmente sean directores
async function cargarDirectores() {
  try {
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=es-ES&page=1`
    );
    const datos = await respuesta.json();

    // Tomamos solo los primeros 15 para no hacer demasiadas peticiones
    const candidatos = datos.results.slice(0, 15);

    const directoresReales = [];

    for (const persona of candidatos) {
      // Consultar créditos de películas
      const resCreditos = await fetch(
        `https://api.themoviedb.org/3/person/${persona.id}/movie_credits?api_key=${apiKey}&language=es-ES`
      );
      const creditos = await resCreditos.json();

      // Verificar si aparece como Director en crew
      const trabajosDirector = creditos.crew.filter(c => c.job === 'Director');

      if (trabajosDirector.length > 0) {
        directoresReales.push(persona);
      }
    }

    mostrarDirectores(directoresReales);
  } catch (error) {
    console.error('Error al cargar los directores:', error);
    directoresContainer.innerHTML = '<p>No se pudieron cargar los directores.</p>';
  }
}

function mostrarDirectores(directores) {
  directoresContainer.innerHTML = '';

  directores.forEach(director => {
    const div = document.createElement('div');
    div.classList.add('director-card');

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${director.profile_path}" alt="${director.name}" />
      <h3>${director.name}</h3>
      <p>Director</p>
    `;

    div.addEventListener('click', () => {
      openModal(director);
    });

    directoresContainer.appendChild(div);
  });
}

// Modal
function openModal(item) {
  modalImg.src = `https://image.tmdb.org/t/p/w500${item.profile_path}`;
  modalTitle.textContent = item.name;
  modalTypeRating.textContent = `Director`;
  modalOverview.textContent = 'Conocido por: ' + (item.known_for?.map(k => k.title || k.name).join(', ') || 'Sin datos');
  moreInfoBtn.dataset.id = item.id;
  moreInfoBtn.dataset.type = 'person';

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
  window.location.href = `details.html?id=${id}&type=person&from=directores`;
});

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  cargarDirectores();
});
