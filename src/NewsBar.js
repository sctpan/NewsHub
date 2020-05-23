import React from 'react'
import './styles.css'
import {Row, Col, Container, Badge} from 'react-bootstrap'
import {IoMdShare} from 'react-icons/io'
import test from './test.jpg'


class NewsBar extends React.Component {
    state = {
        fav: false
    };

    constructor(props) {
        super(props);
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
    }

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
            default: break;
        }
        return {backgroundColor: backgroundColor, color: color};
    }

    shareNews = () => {
        console.log("shareNews: " + this.props.index);
        this.props.shareNews(this.props.index);
    }


    render() {
        return (
            <div className="newsbar">
                <Row>
                    <Col md="auto">
                        <img onClick={this.putArticleUrl} src={this.props.news.image} className="news-image"/>
                    </Col>
                    <Col>
                            <div className="news-title">
                                <span onClick={this.putArticleUrl}>{this.props.news.title}</span>
                                <button className="share-btn" onClick={this.shareNews}><IoMdShare/></button>
                            </div>
                            <div className="news-description" onClick={this.putArticleUrl}>
                                {this.props.news.description}
                            </div>
                            <div className="news-info" onClick={this.putArticleUrl}>
                                <span className="news-time">{this.convertDate(this.props.news.date)}</span>
                                {/*variant={this.getSectionColor(this.props.news.section)*/}
                                <Badge className="news-category" style={this.getSectionColor(this.props.news.section)}>{this.props.news.section.toUpperCase()}</Badge>
                            </div>
                    </Col>

                </Row>

            </div>
        );
    }
}

export default NewsBar;