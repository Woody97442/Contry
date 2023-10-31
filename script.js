// Variables
const resultsRange = document.getElementById("resultsRange");
const resultsValue = document.getElementById("resultsValue");
const sortAscButton = document.getElementById("sortAsc");
const sortDescButton = document.getElementById("sortDesc");
const sortAlphaButton = document.getElementById("sortAlpha");
const resultsContainer = document.getElementById("results");
const inputSearch = document.getElementById("search");

let allCountry = [];
const url = "https://restcountries.com/v3.1/all";

let sortMethod = "default"; // Par défaut, pas de tri

// Mettre à jour la valeur affichée du range et filtrer les pays
inputSearch.addEventListener("input", filterCountries);
resultsRange.addEventListener("input", filterCountries);

// Ajoutez des gestionnaires d'événements aux boutons de tri
sortAscButton.addEventListener("click", function () {
  sortMethod = "croissant";
  filterCountries();
});

sortDescButton.addEventListener("click", function () {
  sortMethod = "decroissant";
  filterCountries();
});

sortAlphaButton.addEventListener("click", function () {
  sortMethod = "alphabétique";
  filterCountries();
});

// Fonction de récupération de tous les pays
async function fetchCountries() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    allCountry = data;
    filterCountries();
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des pays : ",
      error
    );
  }
}

// Fonction pour créer une carte de pays
function createCountryCard(country) {
  const countryCard = document.createElement("div");
  countryCard.classList.add("country-card");

  const img = document.createElement("img");
  img.classList.add("flag-svg");
  img.src = country.flags.svg;

  const name = document.createElement("div");
  name.classList.add("name");
  name.textContent = country.translations.fra.common;

  const capital = document.createElement("div");
  capital.classList.add("capital");
  capital.textContent = country.capital;

  const population = document.createElement("div");
  population.classList.add("population");
  population.textContent = "Population: " + country.population;

  // Ajoutez les éléments à la carte du pays
  countryCard.appendChild(img);
  countryCard.appendChild(name);
  countryCard.appendChild(capital);
  countryCard.appendChild(population);

  return countryCard;
}

// Fonction pour filtrer et afficher les pays
function filterCountries() {
  const searchValue = inputSearch.value.toLowerCase();
  const rangeValue = resultsRange.value;
  resultsValue.innerText = resultsRange.value;

  // Filtrer les pays en fonction du texte de recherche
  const filteredCountries = allCountry.filter((country) => {
    return country.translations.fra.common.toLowerCase().includes(searchValue);
  });

  // Trier les pays en fonction de sortMethod
  if (sortMethod === "croissant") {
    filteredCountries.sort((p1, p2) => p1.population - p2.population);
  } else if (sortMethod === "decroissant") {
    filteredCountries.sort((p1, p2) => p2.population - p1.population);
  } else if (sortMethod === "alphabétique") {
    filteredCountries.sort((p1, p2) =>
      p1.translations.fra.common.localeCompare(p2.translations.fra.common)
    );
  }

  // Utilisez map pour créer un tableau de cartes de pays à partir des pays filtrés et triés
  const countryCards = filteredCountries
    .slice(0, rangeValue)
    .map(createCountryCard);

  // Effacez le contenu précédent
  resultsContainer.innerHTML = "";

  // Insérez les cartes de pays filtrés
  countryCards.forEach((card) => {
    resultsContainer.appendChild(card);
  });
}

// Au chargement initial, affichez tous les pays
fetchCountries();
