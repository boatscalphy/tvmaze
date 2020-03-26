/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.
  let shows = [];
  let response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  response = response.data
  try {
    for (entry of response) {
      shows.push({
        id: entry.show.id,
        name: entry.show.name,
        summary: entry.show.summary,
        image: entry.show.image ? entry.show.image.original : undefined
      })
    }
  }

  catch (e) {
    console.log(e)
  }
  
  return shows
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img src="${show.image}" class="card-img-top" alt="">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#episodeModalLong">Get Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();
  
  let shows = await searchShows(query);

  populateShows(shows);
  $("#shows-list").show();
  $("#search-query").val("")
});

$("#shows-list").on("click", async function searchEpisodes(evt) {
  //Only show episodes when the get episodes button is clicked
  if (evt.target.nodeName === "BUTTON") {
    const showID = Number(evt.target.closest("div .card").dataset.showId)
    const episodes = await getEpisodes(showID);
    populateEpisodes(episodes);
  }

})
/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       https://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  episodes = [];
  let response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  response = response.data;
  try {
    for (episode of response) {
      episodes.push({
      id: episode.id,
      name: episode.name,
      season:episode.season,
      number: episode.number
      })
    }
  }

  catch(e) {
    console.log(e);
  }
  // TODO: return array-of-episode-info, as described in docstring above
  return episodes
}

function populateEpisodes(episodes) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();
  //Hide the list of shows

  for (episode of episodes) {
    let $episode = $(
      `<li>${episode.name} (S${episode.season}E${episode.number})</li>`
    )
    $episodeList.append($episode)
  }

  //Show the list of episodes for the show that was selected
  $("#episodes-area").show();
}
