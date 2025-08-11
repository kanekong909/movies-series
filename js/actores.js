const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';
const actoresContainer = document.getElementById('actores-container');

// Modal
const modal = document.getElementById('popup-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalTypeRating = document.getElementById('modal-type-rating');
const modalOverview = document.getElementById('modal-overview');
const moreInfoBtn = document.getElementById('modal-more-info-btn');

// Cargar actores populares
async function cargarActores() {
  try {
    const respuesta = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=es-ES&page=1`
    );
    const datos = await respuesta.json();

    // Tomamos solo los primeros 15 para no sobrecargar
    const actores = datos.results.slice(0, 15);

    mostrarActores(actores);
  } catch (error) {
    console.error('Error al cargar los actores:', error);
    actoresContainer.innerHTML = '<p>No se pudieron cargar los actores.</p>';
  }
}

function mostrarActores(actores) {
  actoresContainer.innerHTML = '';

  actores.forEach(actor => {
    const div = document.createElement('div');
    div.classList.add('actor-card');

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${actor.profile_path}" alt="${actor.name}" />
      <h3>${actor.name}</h3>
      <p>Actor</p>
    `;

    div.addEventListener('click', () => {
      openModal(actor);
    });

    actoresContainer.appendChild(div);
  });
}

// Modal
function openModal(item) {
  modalImg.src = `https://image.tmdb.org/t/p/w500${item.profile_path}`;
  modalTitle.textContent = item.name;
  modalTypeRating.textContent = `Actor`;
  modalOverview.textContent = 'Conocido por: ' + 
    (item.known_for?.map(k => k.title || k.name).join(', ') || 'Sin datos');
  
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
  window.location.href = `details.html?id=${id}&type=person&from=actores`;
});

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  cargarActores();
});
