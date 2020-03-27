import React from 'react';
import './styles.css'
import NewsFetcher from "./NewsFetcher";
import NewsBox from "./NewsBox";
import NewsBar from "./NewsBar";
import {Row, Col} from "react-bootstrap";

class NewsSearchContent extends React.Component {
    state = {
        newsList: [],
        chosenNewsIndex: 0
    };

    constructor(props) {
        super(props);
    }

    getResults() {
        let url = 'news/search'
        NewsFetcher.get(url, {'q': this.props.query})
            .then(data => {
                this.setState({
                    newsList: data.news
                });
                console.log(this.state.newsList);
            });

    }

    componentDidMount() {
        this.getResults();
    }

    shareNews = index => {
        this.setState({
            chosenNewsIndex: index
        })
    }


    render() {
        return (
            <div className="search-news">
                <div className="results-title">Results</div>
                <Row>
                    {this.state.newsList.map((news, index) =>
                        <Col md={3}>
                            <NewsBox news={news} key={index} index={index} shareNews={this.shareNews} getArticleSource={this.props.getArticleSource}/>
                        </Col>
                    )}
                </Row>

            </div>
        );
    }
}

export default NewsSearchContent;