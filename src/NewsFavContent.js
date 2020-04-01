import React from 'react';
import NewsFetcher from "./NewsFetcher";
import {Col, Modal, Row} from "react-bootstrap";
import NewsBox from "./NewsBox";
import NewsSearchContent from "./NewsSearchContent";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

class NewsFavContent extends React.Component {
    state = {
        newsList: [],
        chosenNewsIndex: 0
    };

    constructor(props) {
        super(props);
    }

    handleClose= () => {
        this.setState({
            showModal: false
        });
    };

    getResults = () => {
        if(localStorage.getItem("news") != null) {
            let news = localStorage.getItem("news");
            let newsList = JSON.parse(news).news;
            this.setState({
                newsList: newsList
            })
            console.log("favorites: " + newsList);
            console.log(newsList[0]);
        }
    };

    componentDidMount() {
        this.getResults();
    }

    shareNews = index => {
        this.setState({
            chosenNewsIndex: index,
            showModal: true
        })
    };

    removeNews = index => {
        let newsList = this.state.newsList;
        newsList.splice(index, 1);
        this.setState({
            newsList: newsList
        });
    };


    render() {
        let showModal = null;
        if(this.state.showModal) {
            showModal = <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="share-modal-title">{this.state.newsList[this.state.chosenNewsIndex].title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="share-via">
                        Share via
                    </div>
                    <Row>
                        <Col className="social-share-btn" md={4}>
                            <FacebookShareButton className="social-share-btn" url={this.state.newsList[this.state.chosenNewsIndex].shareUrl} hashtag={'#CSCI_571_NewsApp'}>
                                <FacebookIcon className="social-share-icon" size={50} round={true}/>
                            </FacebookShareButton>
                        </Col>
                        <Col className="social-share-btn" md={4}>
                            <TwitterShareButton className="social-share-btn" url={this.state.newsList[this.state.chosenNewsIndex].shareUrl} hashtags={['CSCI_571_NewsApp']}>
                                <TwitterIcon className="social-share-icon" size={50} round={true}/>
                            </TwitterShareButton>
                        </Col>
                        <Col className="social-share-btn" md={4}>
                            <EmailShareButton className="social-share-btn" url={this.state.newsList[this.state.chosenNewsIndex].shareUrl} subject={'#CSCI_571_NewsApp'}>
                                <EmailIcon className="social-share-icon" size={50} round={true}/>
                            </EmailShareButton>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>;
        }
        let content = <div className="no-results-title">You have no saved articles</div>;
        if(this.state.newsList.length > 0) {
            content = <div className="results-title">Favorites</div>
        }
        return (
            <div className="search-news">
                {content}
                {showModal}
                <Row>
                    {this.state.newsList.map((news, index) =>
                        <Col md={3}>
                            <NewsBox fav={true} news={news} key={index} index={index} shareNews={this.shareNews} removeNews={this.removeNews} getArticleSource={this.props.getArticleSource}/>
                        </Col>
                    )}
                </Row>
            </div>
        );
    }
}

export default NewsFavContent;