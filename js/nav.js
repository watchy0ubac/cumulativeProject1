"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

//Handle when clicking Create Story on the nav bar

function navCreateStory(e) {
  console.debug("navCreateStory", e);
  navAllStories();
  $createStoryForm.show();
}

$navCreateStory.on("click", navCreateStory);

//Handling favorites on the nav bar
function navFavorites(e) {
  console.debug("navFavorites", e);
  hidePageComponents();
  showFavorites();
}

$navFavorites.on("click", navFavorites);

function navMyStories(e) {
  hidePageComponents();
  showUserStories();
  $ownStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
