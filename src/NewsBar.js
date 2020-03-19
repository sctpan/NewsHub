import React from 'react'
import './styles.css'
import {Row, Col, Container, Badge} from 'react-bootstrap'
import {IoMdShare} from 'react-icons/io'
import test from './test.jpg'

class NewsBar extends React.Component {
    constructor(props) {
        super(props);
    }

    convertDate(date) {
        date = new Date(date);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month < 10 ? "0" + month : "" + month;
        day = day < 10 ? "0" + day : "" + day;
        return date.getFullYear() + '-' + month + '-' + day;
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
                {/*{console.log("news: " + this.props.news.title)}*/}
                <Row>
                    <Col md="auto">
                        <img src={this.props.news.image} className="news-image"/>
                    </Col>
                    <Col>
                        <div className="news-title">
                            {this.props.news.title}
                            <button className="share-btn" onClick={this.shareNews}><IoMdShare/></button>
                        </div>
                        <div className="news-description">
                            {this.props.news.description}
                        </div>
                        <div className="news-info">
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