import React from 'react'
import './styles.css'
import NewsFetcher from "./NewsFetcher";
import {Row, Col, Modal} from "react-bootstrap";
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share'
import {IconContext} from "react-icons";
import {FaRegBookmark} from 'react-icons/fa'
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io'
import BounceLoader from "react-spinners/BounceLoader";
import {css} from "@emotion/core";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import NewsCommentBox from "./NewsCommentBox";


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
       // commentBox('5760240494575616-proj', { defaultBoxId: this.props.currentLink });
    }

    // componentWillUnmount() {
    //     commentBox('5760240494575616-proj', { defaultBoxId: this.props.currentLink });
    // }

    scrollDown() {
        let short = document.getElementsByClassName('detailed-news-description')[0];
        let long = document.getElementsByClassName('detailed-news-description-scroll')[0];
        let upBtn = document.getElementsByClassName('up-btn')[0];
        let downBtn = document.getElementsByClassName('down-btn')[0];
        short.style.display = 'none';
        long.style.display = 'block';
        upBtn.style.display = 'block';
        downBtn.style.display = 'none';
    }

    scrollUp() {
        let short = document.getElementsByClassName('detailed-news-description')[0];
        let long = document.getElementsByClassName('detailed-news-description-scroll')[0];
        let upBtn = document.getElementsByClassName('up-btn')[0];
        let downBtn = document.getElementsByClassName('down-btn')[0];
        short.style.display = '-webkit-box';
        long.style.display = 'none';
        upBtn.style.display = 'none';
        downBtn.style.display = 'block';
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
                <div>
                    <div className="detailed-news">
                        <div className="detailed-news-title">
                            {this.state.news.title}
                        </div>
                        <div className="detailed-news-info">
                            <span className="detailed-news-time">{this.convertDate(this.state.news.date)}</span>
                                <IconContext.Provider value={{ color: "red" }}>
                                    <button className="detailed-news-bookmark">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>Bookmark</Tooltip>
                                            }
                                        >
                                            <FaRegBookmark size={26}/>
                                        </OverlayTrigger>
                                    </button>
                                </IconContext.Provider>
                            <span className="detailed-news-share">
                                 <OverlayTrigger
                                     placement="top"
                                     overlay={
                                         <Tooltip>Facebook</Tooltip>
                                     }
                                 >
                                     <FacebookShareButton className="social-share-btn" url={this.state.news.shareUrl}>
                                        <FacebookIcon className="social-share-icon" size={28} round={true}/>
                                     </FacebookShareButton>
                                 </OverlayTrigger>

                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Twitter</Tooltip>
                                    }
                                >
                                  <TwitterShareButton className="social-share-btn" url={this.state.news.shareUrl}>
                                      <TwitterIcon className="social-share-icon" size={28} round={true}/>
                                  </TwitterShareButton>
                                </OverlayTrigger>

                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Email</Tooltip>
                                    }
                                >
                                    <EmailShareButton className="social-share-btn" url={this.state.news.shareUrl} subject={'#CSCI_571_NewsApp'}>
                                      <EmailIcon className="social-share-icon" size={28} round={true}/>
                                  </EmailShareButton>
                                </OverlayTrigger>


                        </span>
                        </div>

                        <img className="detailed-news-image" src={this.state.news.image}/>

                        <div className="detailed-news-content">
                            <p className="detailed-news-description">
                                {this.state.news.description}
                            </p>
                            <p className="detailed-news-description-scroll">
                                {this.state.news.description}
                            </p>
                            <div className="detailed-news-content-scroll">
                                <button className="invisible">
                                    <IoIosArrowDown size={24}/>
                                </button>
                                <button className="detailed-news-content-scroll-btn down-btn" onClick={this.scrollDown}>
                                    <IoIosArrowDown size={24}/>
                                </button>
                                <button className="detailed-news-content-scroll-btn up-btn" onClick={this.scrollUp}>
                                    <IoIosArrowUp size={24}/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <NewsCommentBox id={this.props.currentLink}/>
                </div>

            );
        }
    }
}

export default ArticleDetail;