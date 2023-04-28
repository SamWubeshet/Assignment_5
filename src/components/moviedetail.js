import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import { Card, ListGroup, ListGroupItem, Form, FormGroup, Col, FormLabel, FormControl, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image } from 'react-bootstrap';
const env = process.env;
class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.updateDetails = this.updateDetails.bind(this);
        this.reviewSub = this.reviewSub.bind(this);

        this.state = {
            details:{
                review: '',
                rating: 0
            }
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));

        }
    }

    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    reviewSub() {
        //const env = runtimeEnv();

        var json = {
            review: this.state.details.review,
            rating: this.state.details.rating,
            Movie_ID: this.props.movieId
        };

        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(json),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                window.location.reload();
            })
            .catch( (e) => console.log(e) );

    }

    render() {
        const DetailInfo = () => {
            if (!this.props.selectedMovie) {
                return <div>Loading....</div>
            }
            return (
                <Card>
                    <Card.Header>Movie Detail</Card.Header>
                    <Card.Body>
                        <Image className="image" src={this.props.selectedMovie.ImageUrl} thumbnail />
                    </Card.Body>
                    <ListGroup>
                        <ListGroupItem>{this.props.selectedMovie.title}</ListGroupItem>
                        <ListGroupItem>
                            {this.props.selectedMovie.actors.map((actor, i) =>
                                <p key={i}>
                                    <b>{actor.actor_name}</b> {actor.character_name}
                                </p>)}
                        </ListGroupItem>
                        <ListGroupItem><h4><BsStarFill/> {this.props.selectedMovie.averageRating}</h4></ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        {this.props.selectedMovie.reviews.map((review, i) =>
                            <p key={i}>
                                <b>{review.username}</b>&nbsp; {review.review}
                                &nbsp;  <BsStarFill /> {review.rating}
                            </p>
                        )}
                    </Card.Body>
                </Card>
            )
        }

        return (
            <div>
                <DetailInfo currentMovie = {this.props.selectedMovie} />
                <Form horizontal>
                    <FormGroup controlId = "review">
                        <Col componentClass={FormLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.review} type="text" placeholder="type review here..." />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="rating">
                        <Col componentClass={FormLabel} sm={2}>
                            rating
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails}
                                         value={this.state.details.rating}
                                         type="number" min="1" max="5" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.reviewSub}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie,
    }
}

export default connect(mapStateToProps)(MovieDetail);