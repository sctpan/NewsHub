import React from 'react';
import './styles.css'
import NewsFetcher from "./NewsFetcher";
import NewsBox from "./NewsBox";
import NewsBar from "./NewsBar";
import {Row, Col, Modal} from "react-bootstrap";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from '@emotion/core'

class NewsSearchContent extends React.Component {
    state = {
        newsList: [],
        chosenNewsIndex: 0,
        showModal: false,
        loading: true
    };

    constructor(props) {
        super(props);
    }

    loaderStyle = css`
        margin: 0 auto;
    `

    handleClose= () => {
        this.setState({
            showModal: false
        });
    };

    getResults() {
        this.setState({
            loading: true
        });
        let url = 'news/search'
        NewsFetcher.get(url, {'q': this.props.query})
            .then(data => {
                this.setState({
                    newsList: data.news
                });
                this.setState({
                    loading: false
                });
                console.log(this.state.newsList);
            });

    }

    componentDidMount() {
        this.getResults();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.query != this.props.query) {
            this.getResults();
        }
    }

    shareNews = index => {
        this.setState({
            chosenNewsIndex: index,
            showModal: true
        })
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

        if(this.state.loading) {
            return (
                <div className="loader">
                    <BounceLoader
                        css={this.loaderStyle}
                        size={36}
                        color={'#364cbc'}
                        loading={this.state.loading}
                    />
                    <div className="loader-text">Loading</div>
                </div>

            );
        } else {
            return (
                <div className="search-news">
                    {showModal}
                    <div className="results-title">Results</div>
                    <Row>
                        {this.state.newsList.map((news, index) =>
                            <Col md={3}>
                                <NewsBox fav={false} news={news} key={index} index={index} shareNews={this.shareNews}
                                         getArticleSource={this.props.getArticleSource}/>
                            </Col>
                        )}
                    </Row>

                </div>
            );
        }
    }
}

export default NewsSearchContent;