String.prototype.capitalize = function(){return `${this.at(0).toUpperCase()}${this.slice(1).toLowerCase()}`}

const pokemonList = document.querySelector(".pokemonList");
const pokemonImg = document.querySelector(".pokemonImg");
const pokemonInfo = document.querySelector(".pokemonInfo");
const pokemonCatched = document.querySelector(".pokemonCatched");
const pokemonName = document.querySelector(".pokemonName");

const pokemonDetails = {
  customClass: {
    popup: 'nes-container',
  },
  title: "Pokemon",
  html: "<p>Esto es una prueba!<p>"
}

const isLogged = async () => {
  if (!sessionStorage.getItem("token")) {
    location.href = "./login.html";
  } else if (!sessionStorage.getItem("profile")) {
    const request = await axios.get(
      "https://ch-simple-login.glitch.me/api/data/profile",
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
    const profile = request.data;
    sessionStorage.setItem("profile", JSON.stringify(profile));
  }

  document.querySelector(".trainerName").innerText = JSON.parse(
    sessionStorage.getItem("profile")
  ).username;
};

const renderPokemonList = async (e) => {
  const request = await axios.get(
    "https://ch-simple-login.glitch.me/api/data/",
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
  );
  const response = request.data.sort((a,b) => a.pid - b.pid);

  pokemonCatched.innerText = response.length;

  response.forEach((pokemon, index) => {
    pokemonList.innerHTML += `
    <tr class="pokemonRow" data-id=${pokemon.id}>
        <td>${pokemon.pid}</td>
        <td>${pokemon.name.capitalize()}</td>
    </tr>`;

    if(index === 0) {
        pokemonName.innerHTML = `#${pokemon.pid} ${pokemon.name.capitalize()}`
        pokemonImg.innerHTML = `<img src="${pokemon.sprite}" alt="${pokemon.name}" />`;
    }
  });
};

const showPokemon = async (e) => {
  if (!e.target.matches("tr") && !e.target.matches("td")) return;
  const id = e.target.matches("tr") ? e.target.dataset.id : e.target.parentNode.dataset.id;
  const request = await axios.get(
    `https://ch-simple-login.glitch.me/api/data/${id}`,
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
  );

  const response = request.data;
  pokemonName.innerHTML = `#${response.pid} ${response.name.capitalize()}`
  pokemonImg.innerHTML = `<img src="${response.sprite}" alt="${response.name}" />`;
};

const showPokemonDetails = async (e) => {
  if(!e.target.matches(".btnDetails")) return;
  Swal.fire(pokemonDetails);
}

const play = (e) => {
  if (!e.target.matches(".btnPlay")) return;
  location.href = "./game.html";
};

const logout = (e) => {
  if (!e.target.matches(".btnLogout")) return;
  sessionStorage.clear();
  location.href = "./login.html";
};

window.addEventListener("load", () => {
  isLogged();
  renderPokemonList();
});

document.addEventListener("click", (e) => {
  logout(e);
  play(e);
  showPokemon(e);
  showPokemonDetails(e);
});
