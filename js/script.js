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

    renderMovies(data.results)
  } catch (error) {
    console.log(error)
  }
}

function getLanguage(e) {
  const lang = e.target.getAttribute('data-lg')
  const languageCode = languages[lang]
  const languagesLink = document.querySelectorAll('#languages .nav-link img')

  languagesLink.forEach((link) => {
    if (link.getAttribute('data-lg') === lang) {
      link.style.borderBottom = '2px solid var(--color-secondary)'
    } else {
      link.style.border = 'none'
    }
  })

  if (languageCode) {
    urlLink = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=${languageCode}&page=1`

    const popularMovies = document.querySelector('#popular-movies')
    popularMovies.innerHTML = ''
  }
  fetchData(urlLink)
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
  const { poster_path, title, overview, release_date, vote_average, id } = movie
  const fullPosterUrl = `${baseImageUrl}${poster_path}` // Construct full image URL;

  movieDetails.innerHTML = `
   <div class="details-top">
          <div>
            <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />
          </div>
          <div>
            <h2>Movie Title</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              8 / 10
            </p>
            <p class="text-muted">Release Date: XX/XX/XXXX</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
              atque molestiae error debitis provident dolore hic odit, impedit
              sint, voluptatum consectetur assumenda expedita perferendis
              obcaecati veritatis voluptatibus. Voluptatum repellat suscipit,
              quae molestiae cupiditate modi libero dolorem commodi obcaecati!
              Ratione quia corporis recusandae delectus perspiciatis consequatur
              ipsam. Cumque omnis ad recusandae.
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              <li>Genre 1</li>
              <li>Genre 2</li>
              <li>Genre 3</li>
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $1,000,000</li>
            <li><span class="text-secondary">Revenue:</span> $2,000,000</li>
            <li><span class="text-secondary">Runtime:</span> 90 minutes</li>
            <li><span class="text-secondary">Status:</span> Released</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">Company 1, Company 2, Company 3</div>
        </div>
  
  `
  console.log(movie)
}

function detailMovie(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${key}`
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
  console.log(window.location.search)
  const queryString = window.location.search
  const id = queryString.split('=')[1]
  console.log(id)
  detailMovie(id)
  const pathName = window.location.pathname
  switch (pathName) {
    case '/':
    case '/index.html':
    case '/movie-details.html':
      highlightActiveLink('Movies')
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
document.addEventListener('DOMContentLoaded', (e) => {
  init()
  fetchData(urlLink, options)
})
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-lg]')) {
    getLanguage(e)
  }
})
