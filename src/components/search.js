import React, { Component} from 'react';
import { submitRegister } from '../actions/authActions';
import {fetchMovies, searchMovie, setMovie, setMovies} from "../actions/movieActions";
import { connect } from 'react-redux';
import {Form, Button, Carousel, Nav, Image} from 'react-bootstrap';
import runtimeEnv from "@mars/heroku-js-runtime-env";
import { Redirect } from 'react-router-dom'
import {LinkContainer} from "react-router-bootstrap";
import {BsStarFill} from "react-icons/bs";

class Search extends Component {

    constructor(props){
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.updateDetails = this.updateDetails.bind(this);
        this.search = this.search.bind(this);
        this.click_handler = this.click_handler.bind(this);
        this.state = {
            search_details:{
                search_term: '',
                redirect: false,
                movies: [],
                results: false,
            }
        };
    }

    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.search_details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            search_details: updateDetails
        });
    }

    search() {
        const {dispatch} = this.props;

        const env = runtimeEnv();
        // return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/search/${this.state.search_details.search_term}`, {
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
            console.log(response.json())
        }).then((res) => {
            // dispatch(moviesFetched(res.movie));
            dispatch(setMovies(res.movie));
            console.log(res.movie);
            // this.setRedirect();
            this.state.search_details.movies = res.movie
            this.state.search_details.results = true
            console.log('here', this.state.search_details.movies)
            console.log('results', this.state.search_details.results)

            // window.location.reload();
            this.forceUpdate();

        }).catch((e) => console.log(e));
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchMovies());
    }

    handleSelect(selectedIndex, e) {
        const {dispatch} = this.props;
        dispatch(setMovie(this.props.movies[selectedIndex]));
    }

    click_handler(movie) {
        const {dispatch} = this.props;
        console.log('in handle click');
        // this.props.selectedMovie = movie
        console.log('this.props.selectedMovie', movie);

        dispatch(setMovie(movie));
        // console.log('this.props.selectedMovie', this.props.selectedMovie);

    }

    render(){
        if (this.state.search_details.results === false) {
            return (
                <div>
                    <Form className='form-horizontal'>
                        <Form.Group controlId="search_term">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={this.updateDetails} value={this.state.search_details.search_term} type="text" placeholder="Search for a movie" />
                        </Form.Group>

                        <Button onClick={this.search}>Search</Button>

                    </Form>
                </div>

            )
        }
        else {
            return (
                <div>
                    <Form className='form-horizontal'>
                        <Form.Group controlId="search_term">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={this.updateDetails} value={this.state.search_details.search_term} type="text" placeholder="Search for a movie" />
                        </Form.Group>

                        <Button onClick={this.search}>Search</Button>

                        <Carousel onSelect={this.handleSelect}>

                            {this.state.search_details.movies.map((mov) =>
                                <Carousel.Item key={mov.title}>
                                    <div>
                                        <Image className="image" src={mov.imageUrl} thumbnail />
                                    </div>
                                    <Carousel.Caption>
                                        <h3>{mov.title}</h3>
                                        <BsStarFill glyph={'star'} /> {mov.averaged_rating} &nbsp;&nbsp; {mov.year_released}
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )}

                        </Carousel>
                    </Form>
                </div>

            )
        }
    }
}

const mapStateToProps = state => {
    console.log('mapStateToProps', state.movie.movies);
    return {

        movies: state.movie.movies
    }
}

export default connect(mapStateToProps)(Search);