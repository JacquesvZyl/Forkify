import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';

/* if (module.hot) {
  module.hot.accept();
} */

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark sselected search result
    resultsView.update(model.getSearchResultsPage());
    // LOADING RECIPE

    await model.loadRecipe(id);
    // RENDERING RECIPE
    recipeView.render(model.state.recipe);

    // Update Bookmarks view

    bookmarksView.update(model.state.bookmarks);
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
  model.updateServings(newServings);
  // Update recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  //1 Add/Remove bookmark
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.removeBookmark(model.state.recipe.id);

  //2 Update recipe view
  recipeView.update(model.state.recipe);

  //3 rendier bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(data) {
  try {
    addRecipeView.renderSpinner();
    //Upload new recipe
    await model.uploadRecipe(data);

    // render recipe
    recipeView.render(model.state.recipe);

    //Successs messsage
    addRecipeView.renderMessage();

    //render bookmark
    bookmarksView.render(model.state.bookmarks);

    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(e => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHanderUpload(controlAddRecipe);
}

init();
