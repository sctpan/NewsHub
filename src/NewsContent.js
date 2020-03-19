import React from 'react';
import NewsBar from "./NewsBar";
import NewsFetcher from "./NewsFetcher";
import './styles.css'

class NewsContent extends React.Component {
    state = {
        newsList: []
    };

    getNews(url, section) {
        NewsFetcher.get(url, {'section': section})
            .then(data => {
                this.setState({
                    newsList: data.news
                });
                console.log(this.state.newsList)
            });
    }

    convertSection(link) {
        let section = '';
        if(this.props.nyTimesFlag) {
            let guardianSection = {'home': 'all', 'world': 'world', 'politics': 'politics', 'business': 'business', 'technology': 'technology', 'sports': 'sport'};
            section = guardianSection[link];
        } else {
            let guardianSection = {'home': 'all', 'world': 'world', 'politics': 'politics', 'business': 'business', 'technology': 'technology', 'sports': 'sport'};
            section = guardianSection[link];
        }
        return section;
    }

    componentDidMount() {
        this.getNews('news/guardian', 'all');
    }

    componentDidUpdate(prevProps) {
        if (this.props.nyTimesFlag !== prevProps.nyTimesFlag) {
            console.log("getNews: " + this.props.nyTimesFlag);
        }

        if (this.props.currentLink !== prevProps.currentLink) {
            let url = 'news/guardian';
            let section = this.convertSection(this.props.currentLink);
            if(this.props.nyTimesFlag) {
                url = 'news/guardian'; // need to modify
            }
            this.getNews(url, section);
            console.log("currentLink: " + this.props.currentLink);
        }
    }

    render() {
        return (
            <div className="news">
                {/*{console.log("newsList: " + this.state.newsList[0].title)}*/}
                {this.state.newsList.map((news) =>
                    <NewsBar news={news} key={news.id}/>
                )}
            </div>
        );
    }
}

export default NewsContent;