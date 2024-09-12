const tokey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTQwMGM4N2FmZTEyMzkzZGMyZTM1YzUwNDQwM2JkMCIsIm5iZiI6MTcyNTg2MTQ3OS42NjQzNTYsInN1YiI6IjY0OWIyM2I3MGU1YWJhMDBjNTkxYWUzYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._raW47XBufu1iIJ5yMMzzPt51cTtPOWSkLPOkfOhGdA'
const key = 'f5400c87afe12393dc2e35c504403bd0'
let urlLink = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`
const id = window.location.search

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

async function fetchData(url, opt) {
  try {
    const response = await fetch(url, opt)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    // console.log(data.results)

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
    urlLink = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=${languageCode}&page=1`
    fetchData(urlLink)
  }
}

// Render movies
const baseImageUrl = 'https://image.tmdb.org/t/p/w500' // base URL for images

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
  function productionCompanies(Companies) {
    let companyList = ''
    Companies.forEach((company) => {
      companyList += `  <div class="list-group">${company.name} </div>`
    })
    return companyList
  }
  function voteRating(vote_average) {
    const rating = Math.round(vote_average)
    const calcAverage = (rating / 10) * 5

    const fullStar = Math.round(calcAverage)
    let ratingHTML = ''
    for (let i = 0; i < 5; i++) {
      if (i < fullStar) {
        ratingHTML += `<i class="fas fa-star text-primary"></i>
        `
      } else {
        ratingHTML += `<i class="far fa-star text-primary"></i>`
      }
    }
    return ratingHTML
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
             ${voteRating(vote_average)} 
            </p>
            <p class="text-muted">Release Date: ${release_date}</p>
            <p>
              ${overview}
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
            <li><span class="text-secondary">Budget:</span> $ ${budget}</li>
            <li><span class="text-secondary">Revenue:</span> $ ${revenue}</li>
            <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${status}</li>
          </ul>
          <h4>Production Companies</h4>
          ${productionCompanies(production_companies)}
        
        </div>
  
  `
}

function detailMovie() {
  const queryString = window.location.search
  const id = queryString.split('=')[1]
  const lang = localStorage.getItem('lang')

  const languageCode = languages[lang]

  const url = `https://api.themoviedb.org/3/movie/${id}?language=${languageCode}&api_key=${key}`

  async function fetchData(url, opt) {
    try {
      const response = await fetch(url, opt)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      renderMovieDetails(data)
    } catch (error) {
      console.log(error)
    }
  }

  fetchData(url)
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
