import React from 'react'
import './styles.css'
import {Row, Col, Container, Badge} from 'react-bootstrap'
import {IoMdShare} from 'react-icons/io'
import {MdDelete} from 'react-icons/md'

import test from './test.jpg'
import {toast, ToastContainer, Zoom} from "react-toastify";

class NewsBox extends React.Component {
    state = {
        fav: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
            fav: this.props.fav
        })
    }

    convertDate(date) {
        return date.substring(0, 10);
    }

    putArticleUrl = () => {
        if(this.props.news.source === 'NYTIMES') {
            this.props.getArticleSource(true);
        } else {
            this.props.getArticleSource(false);
        }
        window.location.href = '#/article?id=' + this.props.news.id;
    };

    getSectionColor(section) {
        var backgroundColor = '#6f757b';
        var color = 'white';
        switch (section) {
            case "world": backgroundColor = '#7555f6'; break;
            case "politics": backgroundColor = '#579288'; break;
            case 'business': backgroundColor = '#5b95e5'; break;
            case 'technology': backgroundColor = '#d1db59'; color = 'black'; break;
            case 'sports': backgroundColor = '#eec35c'; color = 'black'; break;
            case 'sport': backgroundColor = '#eec35c'; color = 'black'; break;
            case 'GUARDIAN': backgroundColor = 'black'; color = 'white'; break;
            case 'NYTIMES': backgroundColor = '#dadada'; color = 'black'; break;
            default: break;
        }
        return {backgroundColor: backgroundColor, color: color};
    }

    shareNews = () => {
        console.log("shareNews: " + this.props.index);
        this.props.shareNews(this.props.index);
    };

    removeNews = () => {
        let news = localStorage.getItem("news");
        let newsList = JSON.parse(news).news;
        let index = newsList.findIndex(news => news.id === this.props.news.id);
        if(index != -1) {
            newsList.splice(index, 1);
        }
        localStorage.setItem("news", JSON.stringify({'news': newsList}));
        this.notify("Removing - " + this.props.news.title);
        this.props.removeNews(this.props.index);
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
        let deleteBtn = null;
        let sourceBadge = null;
        if(this.state.fav) {
            deleteBtn = <button className="share-btn" onClick={this.removeNews}><MdDelete/></button>;
            sourceBadge =  <Badge className="news-category" style={this.getSectionColor(this.props.news.source)}>{this.props.news.source}</Badge>
        }



        return (
            <div className="newsbox">
                <ToastContainer transition={Zoom} />
                <div className="news-title">
                    <span onClick={this.putArticleUrl}>{this.props.news.title}</span>
                    <button className="share-btn" onClick={this.shareNews}><IoMdShare/></button>
                    {deleteBtn}
                </div>
                <img onClick={this.putArticleUrl} src={this.props.news.image} className="search-news-image"/>
                <div className="news-info" onClick={this.putArticleUrl}>
                    <span className="news-time">{this.convertDate(this.props.news.date)}</span>
                    {sourceBadge}
                    <Badge className="news-category" style={this.getSectionColor(this.props.news.section)}>{this.props.news.section.toUpperCase()}</Badge>
                </div>
            </div>
        );
    }
}

export default NewsBox;