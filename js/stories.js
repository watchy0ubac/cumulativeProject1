"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      <div>
      ${showDeleteBtn ? getDeleteBtn() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <div class="story-author">by ${story.author}</div>
    <div class="story-user">posted by ${story.username}</div>
    </div>
  </li>
    `);
}

function getDeleteBtn() {
  return `
  <span class='trash-can'>
    <i class='fas fa-trash-alt'></i>
  </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function getStarHTML(story, user) {
  const isFavorite = user.favorited(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class='star'>
        <i class='${starType} fa-star'></i>
      </span>`;
}

async function createStory(e) {
  e.preventDefault();
  const author = $("#author-name").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $createStoryForm.slideUp("slow");
  $createStoryForm.trigger("reset");
}

$createStoryForm.on("submit", createStory);

async function showFavorites() {
  $favoriteStoryList.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoryList.append("<h3>No favorites currently added!</h3>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoryList.append($story);
    }
  }
  $favoriteStoryList.show();
}
async function toggleFavorite(e) {
  const $target = $(e.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavorite);

async function deleteStory(e) {
  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  showUserStories();
}

$ownStories.on("click", ".trash-can", deleteStory);

function showUserStories() {
  $ownStories.empty();
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h3>You have not made any stories!</h3>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}
