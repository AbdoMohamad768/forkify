// import icons from '../img/icons.svg' // Parcel 1
import icons from 'url:../img/icons.svg'; // Parcel 2
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// const recipeContainer = document.querySelector('.recipe');
// const btnSearch = document.querySelector('.search__btn');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    recipeView.renderSpiner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);

    // Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render search results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  // Render New search results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render New the initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // Add/Delete recipe to state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpiner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render success message
    addRecipeView.renderMessage();

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerBookmarks(controlAddBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
