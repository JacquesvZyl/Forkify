import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // LOADING RECIPE
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    // 1) get serach query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load Search results
    await model.loadSearchResults(query);

    // Render Search Results

    resultsView.render(model.getSearchResultsPage());

    // render pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

function controlPagination(goToPage) {
  // Render Search Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render pagination btns
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  console.log(model.state.recipe);
  model.updateServings(newServings);
  // Update recipe view
  recipeView.render(model.state.recipe);
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
}
init();
