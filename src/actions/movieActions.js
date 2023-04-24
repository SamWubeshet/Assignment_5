import actionTypes from '../constants/actionTypes';
//import runtimeEnv from '@mars/heroku-js-runtime-env'
const env = process.env;
function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

function moviesSet(movies) {
    return {
        type: actionTypes.SET_MOVIES,
        selectedMovies: movies
    }
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function setMovies(movies) {
    return dispatch => {
        dispatch(moviesSet(movies));
    }
}

export function fetchMovie(movie_title) {
   
    console.log('fetch',movie_title)
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies/${movie_title}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            console.log('res', res)
            dispatch(movieFetched(res.movie[0]));
        }).catch((e) => console.log(e));
    }
}

export function fetchMovies() {
   
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(moviesFetched(res.movie));
        }).catch((e) => console.log(e));
    }
}
//
export function postReview(review_data) {
    
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors',
            body: JSON.stringify(review_data)
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            // console.log(res.json())
            window.location.reload();
        }).catch((e) => console.log(e));
    }
}

export function searchMovie(search_term) {
    
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/search/${search_term}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            // dispatch(moviesFetched(res.movie));
            console.log(res.movie);
        }).catch((e) => console.log(e));
    }
}