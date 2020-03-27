import React,  { useState } from 'react';
import './App.css';
import NewsNavbar from './NewsNavbar';
import NewsContent from "./NewsContent";
import ArticleDetail from './ArticleDetail'
import NewsSearchContent from './NewsSearchContent'

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            nyTimesFlag: true,
            articleNyTimesFlag: true,
            sectionCurrentLink: 'home',
            articleCurrentLink: null,
            query: null
        }
    }

    getArticleSource = nyTimesFlag => {
        this.setState({
            articleNyTimesFlag: nyTimesFlag
        });
    };


    getSource = nyTimesFlag => {
        this.setState({
            nyTimesFlag: nyTimesFlag,
            articleNyTimesFlag: nyTimesFlag
        });
    };

    getRoute = route => {
        console.log(route);
        let sections = new Set(['Home', 'World', 'Politics', 'Business', 'Technology', 'Sports']);
        if(sections.has(route)) {
            this.setState({
                sectionCurrentLink: route.toLowerCase(),
                articleCurrentLink: null,
                query: null
            })
        } else {
            if(route.indexOf('?') !== -1) {
                let action = route.substr(0, route.indexOf('?'));
                if(action === 'article') {
                    this.setState({
                        articleCurrentLink: route.substr(route.indexOf('=')+1),
                        sectionCurrentLink: null,
                        query: null
                    });
                } else if(action === 'search') {
                    this.setState({
                        articleCurrentLink: null,
                        sectionCurrentLink: null,
                        query: route.substr(route.indexOf('=')+1)
                    });
                }
            }
        }
    }


    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.getRoute(window.location.hash.substr(2));
        });
    }

    render() {
        let mainContent;
        if(this.state.sectionCurrentLink != null) {
            mainContent = <NewsContent nyTimesFlag={this.state.nyTimesFlag} currentLink={this.state.sectionCurrentLink}/>
        } else if(this.state.articleCurrentLink != null) {
            mainContent = <ArticleDetail nyTimesFlag={this.state.articleNyTimesFlag} currentLink={this.state.articleCurrentLink}/>
        } else if(this.state.query != null) {
            mainContent = <NewsSearchContent getArticleSource={this.getArticleSource} query={this.state.query}/>
        }



        return (
            <div>
                <NewsNavbar nyTimesFlag={this.state.nyTimesFlag} getSource={this.getSource} activeSection={this.state.sectionCurrentLink}/>
                {mainContent}
            </div>
        );
    }


}


export default App;
