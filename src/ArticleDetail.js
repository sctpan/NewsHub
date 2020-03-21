import React from 'react'
import './styles.css'
import NewsFetcher from "./NewsFetcher";
import {Row, Col, Modal} from "react-bootstrap";
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share'
import {IconContext} from "react-icons";
import {FaRegBookmark} from 'react-icons/fa'
import BounceLoader from "react-spinners/BounceLoader";
import {css} from "@emotion/core";


class ArticleDetail extends React.Component {
    state = {
        news: {},
        loading: true,
        showModal: false,
    };

    loaderStyle = css`
        margin: 0 auto;
    `


    getNews(url, articleId) {
        this.setState({
            loading: true
        })
        NewsFetcher.get(url, {'id': articleId})
            .then(data => {
                this.setState({
                    news: data.news
                });
                this.setState({
                    loading: false
                });
            });
    }

    convertDate(date) {
        date = new Date(date);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month < 10 ? "0" + month : "" + month;
        day = day < 10 ? "0" + day : "" + day;
        return date.getFullYear() + '-' + month + '-' + day;
    }


    componentDidMount() {
        let url = 'news/guardian/article';
        if(this.props.nyTimesFlag) {
            url = 'news/nytimes/article';
        }
        this.getNews(url, this.props.currentLink);
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
            return (
                <div className="detailed-news">
                    <div className="detailed-news-title">
                        {this.state.news.title}
                    </div>
                    <div className="detailed-news-info">
                        <span className="detailed-news-time">{this.convertDate(this.state.news.date)}</span>

                        <IconContext.Provider value={{ color: "red" }}>
                            <button className="detailed-news-bookmark">
                                <FaRegBookmark size={26}/>
                            </button>
                        </IconContext.Provider>

                        <span className="detailed-news-share">
                      <FacebookShareButton className="social-share-btn" url={this.state.news.shareUrl}>
                          <FacebookIcon className="social-share-icon" size={28} round={true}/>
                      </FacebookShareButton>

                      <TwitterShareButton className="social-share-btn" url={this.state.news.shareUrl}>
                          <TwitterIcon className="social-share-icon" size={28} round={true}/>
                      </TwitterShareButton>

                      <EmailShareButton className="social-share-btn" url={this.state.news.shareUrl} subject={'#CSCI_571_NewsApp'}>
                          <EmailIcon className="social-share-icon" size={28} round={true}/>
                      </EmailShareButton>
                  </span>
                    </div>

                    <img className="detailed-news-image" src={this.state.news.image}/>


                </div>
            );
        }
    }
}

export default ArticleDetail;