import React from 'react';
import NewsBar from "./NewsBar";
import NewsFetcher from "./NewsFetcher";
import BounceLoader from 'react-spinners/BounceLoader'
import { css } from '@emotion/core'
import './styles.css'
import {Row, Col, Modal} from "react-bootstrap";
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share'

class NewsContent extends React.Component {
    state = {
        newsList: [],
        loading: true,
        showModal: false,
        chosenNewsIndex: 0
    };

    loaderStyle = css`
        margin: 0 auto;
    `

    handleClose= () => {
        this.setState({
            showModal: false
        });
    };

    getNews(url, section) {
        this.setState({
            loading: true
        })
        NewsFetcher.get(url, {'section': section})
            .then(data => {
                this.setState({
                    newsList: data.news
                });
                this.setState({
                    loading: false
                });
                console.log(this.state.newsList)
            });
    }

    convertSection(link) {
        link = link.toLowerCase();
        let section = '';
        if(this.props.nyTimesFlag) {
            let nyTimesSection = {'home': 'home', 'world': 'world', 'politics': 'politics', 'business': 'business', 'technology': 'technology', 'sports': 'sports'};
            section = nyTimesSection[link];
        } else {
            let guardianSection = {'home': 'all', 'world': 'world', 'politics': 'politics', 'business': 'business', 'technology': 'technology', 'sports': 'sport'};
            section = guardianSection[link];
        }
        return section;
    }

    componentDidMount() {
        this.refreshPage();
    }

    refreshPage() {
        let url = 'news/guardian';
        let section = this.convertSection(this.props.currentLink);
        if(this.props.nyTimesFlag) {
            url = 'news/nytimes';
        }
        this.getNews(url, section);
    }

    componentDidUpdate(prevProps) {
        if (this.props.nyTimesFlag !== prevProps.nyTimesFlag) {
            this.refreshPage();
        }

        if (this.props.currentLink !== prevProps.currentLink) {
            let url = 'news/guardian';
            let section = this.convertSection(this.props.currentLink);
            if(this.props.nyTimesFlag) {
                url = 'news/nytimes';
            }
            this.getNews(url, section);
            console.log("currentLink: " + this.props.currentLink);
        }
    }

    shareNews = index => {
        this.setState({
            chosenNewsIndex: index,
            showModal: true
        })
    }

    render() {
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
                            <Col className="social-share-btn" md={4} xs={4}>
                                <FacebookShareButton className="social-share-btn" url={this.state.newsList[this.state.chosenNewsIndex].shareUrl} hashtag={'#CSCI_571_NewsApp'}>
                                    <FacebookIcon className="social-share-icon" size={50} round={true}/>
                                </FacebookShareButton>
                            </Col>
                            <Col className="social-share-btn" md={4} xs={4}>
                                <TwitterShareButton className="social-share-btn" url={this.state.newsList[this.state.chosenNewsIndex].shareUrl} hashtags={['CSCI_571_NewsApp']}>
                                    <TwitterIcon className="social-share-icon" size={50} round={true}/>
                                </TwitterShareButton>
                            </Col>
                            <Col className="social-share-btn" md={4} xs={4}>
                                <EmailShareButton className="social-share-btn" url={this.state.newsList[this.state.chosenNewsIndex].shareUrl} subject={'#CSCI_571_NewsApp'}>
                                    <EmailIcon className="social-share-icon" size={50} round={true}/>
                                </EmailShareButton>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>;
            }
            return (
                <div className="news">
                    {showModal}
                    {this.state.newsList.map((news, index) =>
                        <NewsBar news={news} key={index} index={index} getArticleSource={this.props.getArticleSource} shareNews={this.shareNews}/>
                    )}
                </div>
            )
        }



    }
}

export default NewsContent;