import React from 'react'
import './styles.css'
import NewsFetcher from "./NewsFetcher";
import {Row, Col, Modal} from "react-bootstrap";
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share'
import {IconContext} from "react-icons";
import {FaRegBookmark, FaBookmark} from 'react-icons/fa'
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io'
import BounceLoader from "react-spinners/BounceLoader";
import {css} from "@emotion/core";
import {OverlayTrigger} from "react-bootstrap";
import NewsCommentBox from "./NewsCommentBox";
import ReactTooltip from "react-tooltip";
import { toast, ToastContainer, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Element, animateScroll as scroll} from "react-scroll";


class ArticleDetail extends React.Component {
    state = {
        news: {},
        loading: true,
        showModal: false,
        saved: false,
        showArrow: true
    };

    loaderStyle = css`
        margin: 0 auto;
    `;

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
                }, this.showOrHideArrow);
                this.setSaved();
            });
    }

    setSaved = () => {
        if(localStorage.getItem("news") === null) {
            this.setState({
                saved: false
            })
        } else {
            let news = localStorage.getItem("news");
            let newsList = JSON.parse(news).news;
            let index = newsList.findIndex(news => news.id === this.state.news.id);
            if(index != -1) {
                this.setState({
                    saved: true
                })
            } else {
                this.setState({
                    saved: false
                })
            }
        }
    };

    showOrHideArrow = () => {
        let words = document.getElementsByClassName('detailed-news-description')[0];
        let style = window.getComputedStyle(words);
        let height = parseInt(style.height.replace('px',''));
        let lineHeight = parseInt(style.lineHeight.replace('px', ''));
        let lines = Math.round(height / lineHeight );
        console.log("article lines: " + lines);
        if(lines >= 6) {
            this.setState({
                showArrow: true
            })
        } else {
            this.setState({
                showArrow: false
            })
        }
    };

    convertDate(date) {
        return date.substring(0, 10);
    }


    componentDidMount() {
        let url = 'news/guardian/article';
        if(this.props.nyTimesFlag) {
            url = 'news/nytimes/article';
        }
        this.getNews(url, this.props.currentLink);
    }

    getPosition(el) {
        if(el === undefined) return {x: 0, y: 0};
        var rect=el.getBoundingClientRect();
        return {x:rect.left,y:rect.top};
    }

    getScrollPosition() {
        var arrow = this.getPosition(document.getElementsByClassName("down-btn")[0]);
        console.log(arrow.y);
        return arrow.y - 30;
    }




    scrollDown = () => {
        scroll.scrollTo(this.getScrollPosition());
        let short = document.getElementsByClassName('detailed-news-description')[0];
        let long = document.getElementsByClassName('detailed-news-description-scroll')[0];
        let upBtn = document.getElementsByClassName('up-btn')[0];
        let downBtn = document.getElementsByClassName('down-btn')[0];
        short.style.display = 'none';
        long.style.display = 'block';

        upBtn.style.display = 'block';
        downBtn.style.display = 'none';


    };

    scrollUp = () => {
        scroll.scrollToTop({duration:300, smooth: true});
        setTimeout(function() {
            let short = document.getElementsByClassName('detailed-news-description')[0];
            let long = document.getElementsByClassName('detailed-news-description-scroll')[0];
            let upBtn = document.getElementsByClassName('up-btn')[0];
            let downBtn = document.getElementsByClassName('down-btn')[0];
            short.style.display = '-webkit-box';
            long.style.display = 'none';
            upBtn.style.display = 'none';
            downBtn.style.display = 'block';
        }, 300);
    };

    saveOrRemoveNews = () => {
        if(this.state.saved) {
            this.setState({
                saved: false
            });
            this.removeNews();
        } else {
            this.setState({
                saved: true
            });
            this.saveNews();
        }
    };

    saveNews = () => {
        if(localStorage.getItem("news") === null) {
            let newsList = [];
            newsList.push(this.state.news);
            localStorage.setItem("news", JSON.stringify({'news': newsList}));
        } else {
            let news = localStorage.getItem("news");
            let newsList = JSON.parse(news).news;
            newsList.push(this.state.news);
            localStorage.setItem("news", JSON.stringify({'news': newsList}));
        }
        this.notify("Saving " + this.state.news.title);
    };

    removeNews = () => {
        if(localStorage.getItem("news") === null) {
            let newsList = [];
            localStorage.setItem("news", JSON.stringify({'news': newsList}));
        } else {
            let news = localStorage.getItem("news");
            let newsList = JSON.parse(news).news;

            let index = newsList.findIndex(news => news.id === this.state.news.id);
            if(index != -1) {
                newsList.splice(index, 1);
            }
            localStorage.setItem("news", JSON.stringify({'news': newsList}));
        }
        this.notify("Removing - " + this.state.news.title);
    };

    notify = (msg) => {
        console.log(msg);
        toast(msg, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false
        });
    };



    render() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let bookmark = this.state.saved ? <FaBookmark size={26}/> : <FaRegBookmark size={26}/>;
        let arrow = this.state.showArrow ?  <button className="detailed-news-content-scroll-btn down-btn" onClick={this.scrollDown}>
            <IoIosArrowDown size={24}/>
        </button> : null;
        let arrowHolder = this.state.showArrow ? <button className="invisible">
            <IoIosArrowDown size={24}/>
        </button> : null;
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
                    <ReactTooltip id="facebook" disable={isMobile} effect="solid" place="top" className="tooltip"/>
                    <ReactTooltip id="twitter" disable={isMobile} effect="solid" place="top" className="tooltip"/>
                    <ReactTooltip id="email" disable={isMobile} effect="solid" place="top" className="tooltip"/>
                    <ReactTooltip id="article-bookmark" disable={isMobile} effect="solid" place="top" className="tooltip"/>
                    <div className="detailed-news">
                        <div className="detailed-news-title">
                            {this.state.news.title}
                        </div>
                        <div className="detailed-news-info">
                            <span className="detailed-news-time">{this.convertDate(this.state.news.date)}</span>
                            <span>
                                <IconContext.Provider value={{ color: "red" }}>

                                            <button  className="detailed-news-bookmark" onClick={this.saveOrRemoveNews}>
                                                <ToastContainer transition={Zoom} />
                                                <span data-tip="Bookmark" data-for="article-bookmark">
                                                    {bookmark}
                                                </span>

                                            </button>

                                </IconContext.Provider>
                            </span>

                            <span className="detailed-news-share">

                                     <FacebookShareButton  className="social-share-btn" url={this.state.news.shareUrl}>
                                         <span data-tip="Facebook" data-for='facebook' >
                                             <FacebookIcon className="social-share-icon" size={28} round={true}/>
                                         </span>
                                     </FacebookShareButton>



                                  <TwitterShareButton  className="social-share-btn" url={this.state.news.shareUrl}>
                                      <span data-tip="Twitter" data-for='twitter' >
                                        <TwitterIcon className="social-share-icon" size={28} round={true}/>
                                      </span>
                                  </TwitterShareButton>



                                    <EmailShareButton  className="social-share-btn" url={this.state.news.shareUrl} subject={'#CSCI_571_NewsApp'}>
                                        <span data-tip="Email" data-for='email' >
                                            <EmailIcon className="social-share-icon" size={28} round={true}/>
                                        </span>
                                  </EmailShareButton>

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
                                {arrowHolder}
                                {arrow}
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