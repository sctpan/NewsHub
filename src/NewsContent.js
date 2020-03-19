import React from 'react';
import NewsBar from "./NewsBar";
import NewsFetcher from "./NewsFetcher";
import BounceLoader from 'react-spinners/BounceLoader'
import { css } from '@emotion/core'
import './styles.css'

class NewsContent extends React.Component {
    state = {
        newsList: [],
        loading: true
    };

    loaderStyle = css`
        margin: 0 auto
    `;

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
                })
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
                <div className="news">
                    <BounceLoader
                        loading={this.state.loading}
                    />
                    {this.state.newsList.map((news) =>
                        <NewsBar news={news} key={news.id}/>
                    )}
                </div>
            )
        }



    }
}

export default NewsContent;