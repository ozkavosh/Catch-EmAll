const pokemonList = document.querySelector(".pokemonList");
const pokemonImg = document.querySelector(".pokemonImg");
const pokemonInfo = document.querySelector(".pokemonInfo");

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

  response.forEach((pokemon, index) => {
    pokemonList.innerHTML += `
    <tr class="pokemonRow" data-id=${pokemon.id}>
        <td>${pokemon.pid}</td>
        <td>${pokemon.name}</td>
    </tr>`;

    if(index === 0) {
        pokemonImg.innerHTML = `<img src="${pokemon.sprite}" alt="${pokemon.name}" />`;
        pokemonInfo.innerHTML = `Encontrados: ${pokemon.catches}`;
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
  pokemonImg.innerHTML = `<img src="${response.sprite}" alt="${response.name}" />`;
  pokemonInfo.innerHTML = `Encontrados: ${response.catches}`;
};

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
});
