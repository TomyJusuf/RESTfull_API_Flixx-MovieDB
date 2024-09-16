const tokey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTQwMGM4N2FmZTEyMzkzZGMyZTM1YzUwNDQwM2JkMCIsIm5iZiI6MTcyNTg2MTQ3OS42NjQzNTYsInN1YiI6IjY0OWIyM2I3MGU1YWJhMDBjNTkxYWUzYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._raW47XBufu1iIJ5yMMzzPt51cTtPOWSkLPOkfOhGdA'

// const id = window.location.search

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${tokey}`,
  },
}
const languages = {
  en: 'en-GB',
  cs: 'cs-CS',
  de: 'de-DE',
  ar: 'ar-SA',
  fr: 'fr-FR',
  it: 'it-IT',
  chi: 'zh-CN',
}
const baseImageUrl = 'https://image.tmdb.org/t/p/w500' // base URL for images
async function fetchData(url, opt) {
  try {
    const response = await fetch(url, opt)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    renderMovies(data.results)
  } catch (error) {
    console.log(error)
  }
}

function getLanguage(e) {
  let lang =
    e?.target?.getAttribute('data-lg') || localStorage.getItem('lang') || 'en'
  localStorage.setItem('lang', lang)
  const languageCode = languages[lang]

  const languagesLink = document.querySelectorAll('#languages .nav-link img')

  languagesLink.forEach((link) => {
    if (link.getAttribute('data-lg') === lang) {
      link.style.borderBottom = '2px solid var(--color-secondary)'
    } else {
      link.style.border = 'none'
    }
  })

  const popularMovies = document.querySelector('#popular-movies')

  if (popularMovies) {
    popularMovies.innerHTML = ''
  }
  if (languageCode) {
    urlLink = `https://api.themoviedb.org/3/movie/popular?language=${languageCode}&page=1`
    fetchData(urlLink, options)
  }
}

// Render movies

function renderMovies(movies) {
  movies.forEach((movie) => {
    const { poster_path, title, release_date, id } = movie
    const fullPosterUrl = `${baseImageUrl}${poster_path}` // Construct full image URL

    const popularMovies = document.querySelector('#popular-movies')
    const oneMovie = `
      <div class="card" id="${id}">
        <a href="movie-details.html?id=${id}">
          <img
            src="${fullPosterUrl}"
            class="card-img-top"
            alt="${title}"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${release_date}</small>
          </p>
        </div>
      </div>
    `
    popularMovies.innerHTML += oneMovie
  })
}

function renderMovieDetails(movie) {
  const movieDetails = document.querySelector('#movie-details')
  const {
    poster_path,
    title,
    overview,
    release_date,
    vote_average,
    homepage,
    budget,
    revenue,
    runtime,
    status,
    genres,
    production_companies,
  } = movie

  const fullPosterUrl = `${baseImageUrl}${poster_path}` // Construct full image URL;
  function loopGenres(genres) {
    let genreList = ''
    genres.forEach((genre) => {
      genreList += `<li>${genre.name}</li>`
    })
    return genreList
  }
  function productionCompanies(companies) {
    let companyList = ''
    companies.forEach((company) => {
      companyList += `  <div class="list-group">${company.name} </div>`
    })
    return companyList
  }

  movieDetails.innerHTML = `
   <div class="details-top">
          <div>
            <img
              src="${fullPosterUrl}"
              class="card-img-top"
              alt="${title}"
            />
          </div>
          <div>
            <h2>${title}</h2>
            <p>
           <i class="fas fa-star text-primary"></i>
           ${Math.round(vote_average)} /10 
            </p>
            <p class="text-muted">Release Date: ${release_date}</p>
            <p>
              ${overview ? overview : 'No overview available'}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${loopGenres(genres)}
            </ul>
            <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $ ${budget.toLocaleString()}</li>

            <li><span class="text-secondary">Revenue:</span> $ ${revenue.toLocaleString()}</li>
            <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${status}</li>
          </ul>
          <h4>Production Companies</h4>
          ${productionCompanies(production_companies)}
        
        </div>
  
  `
}

async function detailMovie() {
  const queryString = window.location.search
  const id = queryString.split('=')[1]
  const lang = localStorage.getItem('lang')

  const languageCode = languages[lang]
  const fallbackLanguage = 'en-Us'

  async function fetchData(lang) {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=${
      lang ? lang : languageCode
    }`
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }
  let data = await fetchData()

  if (!data.overview) {
    console.log(
      `No overview in ${languageCode}, fetching in fallback language (${fallbackLanguage})...`
    )
    data = await fetchData(fallbackLanguage)
  }
  renderMovieDetails(data)
  fetchData()
}

// Highlight active link based on the link name
function highlightActiveLink(linkName) {
  const links = document.querySelectorAll('.nav-link')
  links.forEach((link) => {
    if (link.innerText === linkName) {
      link.classList.add('active')
    } else {
      link.classList.remove('active') // Clear active class from other links
    }
  })
}

function getTvShows() {
  const lang = localStorage.getItem('lang')

  const languageCode = languages[lang]
  const url = `https://api.themoviedb.org/3/tv/popular?language=${languageCode}`
  async function fetchData() {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      renderTvShows(data.results)
    } catch (error) {
      console.log(error)
    }
  }
  fetchData()
}

function renderTvShows(data) {
  data.forEach((movie) => {
    const { poster_path, name, first_air_date, id } = movie
    const populatTvShows = document.getElementById('popular-shows')
    const oneMovie = `
    <div class="card">
      <a href="tv-details.html?id=${id}">
      <img src="${
        poster_path ? `${baseImageUrl}${poster_path}` : 'images/no-image.jpg'
      }"
      class="card-img-top"
      alt="${name || 'images/no-image.jpg'}"/>
      </a>
      <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text">
          <small class="text-muted">Aired: ${first_air_date}</small>
      </p>
      </div>
    </div>
`
    populatTvShows.innerHTML += oneMovie
  })
}

async function getDetailsTVShow() {
  const idTvShow = window.location.search.split('=')[1]
  const lang = localStorage.getItem('lang')
  const languageCode = languages[lang]
  const fallbackLanguage = 'en-US'

  async function fetchData(lang) {
    const url = `https://api.themoviedb.org/3/tv/${idTvShow}?language=${
      lang ? lang : languageCode
    }`
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }

  let data = await fetchData(languageCode)

  // If the overview is missing or empty, fetch again with fallback language
  if (!data.overview) {
    console.log(
      `No overview in ${languageCode}, fetching in fallback language (${fallbackLanguage})...`
    )
    data = await fetchData(fallbackLanguage)
  }

  renderDetailsTVShow(data)
}

function renderDetailsTVShow(data) {
  const {
    name,
    overview,
    first_air_date,
    last_episode_to_air,
    status,
    genres,
    poster_path,
    vote_average,
    homepage,
    production_companies,
    episode_run_time,
  } = data

  const showDetails = document.getElementById('show-details')
  const details = `
     <div class="details-top">
          <div>
            <img
              src="${baseImageUrl}${poster_path}"
              class="card-img-top"
              alt="${name || 'images/no-image.jpg'}"
            />
          </div>
          <div>
            <h2>${name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.round(vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${first_air_date}</p>
            <p>
             ${
               overview ? overview : 'No available translation in this language'
             }
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${genres.map((genre) => `<li>${genre.name}</li>`).join(' ')}
            </ul>
            <a href="${homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              episode_run_time[0] || 'N/A'
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                last_episode_to_air.air_date || 'N/A'
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${production_companies
            .map((companies) => `<p>${companies.name}</p>`)
            .join(' ')}</div>
        </div>

  `
  showDetails.innerHTML += details
}

// Initialize the app
function init() {
  const pathName = window.location.pathname
  switch (pathName) {
    case '/':
    case '/index.html':
    case '/movie-details.html':
      highlightActiveLink('Movies')
      if (pathName === '/' || pathName === '/index.html') {
        getLanguage()
      } else if (pathName === '/movie-details.html') {
        detailMovie()
      }
      break
    case '/shows.html':
    case '/tv-details.html':
      highlightActiveLink('TV Shows')
      if (pathName === '/shows.html') {
        getTvShows()
      } else {
        getDetailsTVShow()
      }
      break
    case '/search.html':
      break
    default:
      console.error('Page not found: 404')
  }
}

// Start when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  init()
})
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-lg]')) {
    getLanguage(e)
  }
})
