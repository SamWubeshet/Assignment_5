import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { fetchMovie } from "../actions/movieActions";
import MovieDetail from "../components/moviedetail"

// support routing

function Movie(props) {
    const [selectedMovie] = useState(props.selectedMovie);
    const params = useParams();
    const movie_title = params.movie_title;
    console.log('movie',params.movie_title);
    const dispatch = useDispatch();
    if (selectedMovie == null) {
        dispatch(fetchMovie(movie_title));
    }

    return (<MovieDetail movieId={movie_title} />)
}

export default Movie;