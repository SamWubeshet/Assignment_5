import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import { postReview } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image } from 'react-bootstrap';
//import {submitLogin} from "../actions/authActions";
import { Form, FormControl, Button } from 'react-bootstrap';

class MovieDetail extends Component {

     componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    constructor(props) {
        super(props);
        this.updateDetails = this.updateDetails.bind(this)
        this.submitReview = this.submitReview.bind(this)
        this.state = {
            review_details: {
                title: "",
                rating: 0,
                review: ""
            }
        }

        this.rating = ''
        this.message = ''
    }


    submitReview(){
        console.log("in submit review")
        const {dispatch} = this.props;
        if (this.state.review_details.review === "" || this.state.review_details.rating === 0) {
            alert("Empty rating or review");
        } else {
            this.state.review_details.title = this.props.selectedMovie.title;
            console.log('review_details', this.state.review_details)
            dispatch(postReview(this.state.review_details));
        }

    }

    updateDetails(event) {

        // console.log("in update details")
        let updateDetails = Object.assign({}, this.state.review_details)

        updateDetails[event.target.id] = event.target.value;

        this.setState({
            review_details: updateDetails
        })
        // console.log('update details', updateDetails)
    }

    render() {

        //const DetailInfo = () => {
        if (!this.props.selectedMovie) {
            return <div>Loading....</div>
        }

        return (
            <Card>
                <Card.Header>Movie Detail</Card.Header>
                <Card.Body>
                    <Image className="image" src={this.props.selectedMovie.imageUrl} thumbnail/>
                </Card.Body>
                <ListGroup>
                    <ListGroupItem>{this.props.selectedMovie.title}</ListGroupItem>
                    <ListGroupItem>
                        {this.props.selectedMovie.actors.map((actor, i) =>
                            <p key={i}>
                                <b>{actor.actorName}</b> {actor.characterName}
                            </p>)}
                    </ListGroupItem>
                    <ListGroupItem><h4><BsStarFill/> {this.props.selectedMovie.averageRating}</h4></ListGroupItem>
                </ListGroup>
                <Card.Body>
                    {this.props.selectedMovie.reviews.map((review, i) =>
                        <p key={i}>
                            <b>{review.username}</b>&nbsp; {review.review}
                            &nbsp;  <BsStarFill/> {review.rating}
                        </p>
                    )}
                </Card.Body>
                <Form>
                    <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <FormControl onChange={this.updateDetails} value={this.state.review_details.rating}
                                      type="number" min="1" max="5"/>
                    </Form.Group>

                    <Form.Group controlId="review">
                        <Form.Label>Review</Form.Label>
                        <FormControl onChange={this.updateDetails} value={this.state.review_details.review}
                                      type="text" placeholder="Write a new review"/>
                    </Form.Group>

                    <Button onClick={this.submitReview}>Submit Review</Button>
                </Form>
            </Card>
        )
    }
    //     }
    //
    //     return (
    //         <DetailInfo />
    //     )
    // }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie
    }
}

export default connect(mapStateToProps)(MovieDetail);