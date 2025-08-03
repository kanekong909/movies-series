// details.js
const apiKey = "c430c77d8b25dc96309ce5d466d3c372";

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get("id"),
    type: params.get("type"),
  };
}

const { id, type } = getParams();

async function fetchDetails() {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=es-ES`);
  const data = await res.json();
  renderDetails(data);
}

async function renderDetails(data) {
  document.getElementById("titulo").textContent = (data.title || data.name).toUpperCase();
  document.getElementById("poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  document.getElementById("poster").alt = data.title || data.name;
  document.getElementById("sinopsis").textContent = data.overview;
  document.getElementById("categorias").innerHTML = data.genres.map(g => `<span class="chip"><p class="categoria">${g.name}</p></span>`).join("");

  const id = data.id;
  const tipo = data.title ? "movie" : "tv"; // Detectar si es película o serie
  const apiKey = "c430c77d8b25dc96309ce5d466d3c372"; // Reemplaza con tu clave real

  try {
    const res = await fetch(`https://api.themoviedb.org/3/${tipo}/${id}/credits?api_key=${apiKey}`);
    const credits = await res.json();

    // Tomamos solo los primeros 5 actores (puedes cambiar este número)
    const principales = credits.cast.slice(0, 5);

    const actoresHTML = principales.map(actor => `
      <span class="chip">${actor.name}</span>
    `).join("");

    document.getElementById("actores").innerHTML = `
      <h3 class="reparto">Reparto principal</h3>
      ${actoresHTML}
    `;
  } catch (error) {
    console.error("Error al cargar actores:", error);
  }
}

async function fetchTrailer() {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=es-ES`);
  const data = await res.json();

  const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  if (trailer) {
    document.getElementById("trailer").innerHTML = `
      <h3 class="trailer">Tráiler</h3>
      <iframe width="100%" height="300" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
    `;
  }
}

async function fetchSimilarContent() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${apiKey}&language=es-ES`);
    const data = await res.json();

    const similares = data.results.slice(0, 12); // Muestra solo los primeros 12 similares

    const contenedor = document.querySelector(".related-movies");
    contenedor.innerHTML = `
      <h3 class="titulo-similares">Similares</h3>
      <div class="galeria-similares">
        ${similares.map(item => `
          <div class="card-similar" onclick="redirigirADetalles('${item.id}', '${type}')">
            <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.title || item.name}">
            <p>${item.title || item.name}</p>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error al cargar contenido similar:", error);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  fetchDetails();
  fetchTrailer();
  fetchSimilarContent();
});
