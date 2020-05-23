import React,  { useState } from 'react';
import './App.css';
import NewsNavbar from './NewsNavbar';
import NewsContent from "./NewsContent";
import ArticleDetail from './ArticleDetail'
import NewsSearchContent from './NewsSearchContent'
import NewsFavContent from "./NewsFavContent";

class App extends React.Component {
    constructor() {
        super();
        window.location.href = '#/Home';
        let nyTimesFlag = true;
        if(localStorage.getItem('source') != null) {
            let source = localStorage.getItem('source');
            if(source === 'GUARDIAN') {
                nyTimesFlag = false;
            }
        }
        this.state = {
            nyTimesFlag: nyTimesFlag,
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
        let source = 'GUARDIAN';
        if(nyTimesFlag) {
            source = 'NYTIMES';
        }
        localStorage.setItem('source', source);
    };


    getRoute = route => {
        console.log("route changed: " + route);
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
                    console.log("query changed: " + route.substr(route.indexOf('=')+1))
                    this.setState({
                        articleCurrentLink: null,
                        sectionCurrentLink: null,
                        query: route.substr(route.indexOf('=')+1)
                    });
                }
            } else {
                if(route === 'favorites') {
                    this.setState({
                        sectionCurrentLink: null,
                        articleCurrentLink: null,
                        query: null
                    })
                }
            }
        }
    };




    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.getRoute(window.location.hash.substr(2));
        });

    }

    render() {
        let mainContent;
        let fav = false;
        let search = false;
        if(this.state.sectionCurrentLink != null) {
            fav = false;
            search = false;
            mainContent = <NewsContent nyTimesFlag={this.state.nyTimesFlag} getArticleSource={this.getArticleSource} currentLink={this.state.sectionCurrentLink}/>
        } else if(this.state.articleCurrentLink != null) {
            fav = false;
            search = false;
            mainContent = <ArticleDetail nyTimesFlag={this.state.articleNyTimesFlag} currentLink={this.state.articleCurrentLink}/>
        } else if(this.state.query != null) {
            console.log("query page rendered!")
            fav = false;
            search = true;
            mainContent = <NewsSearchContent getArticleSource={this.getArticleSource} query={this.state.query}/>
        } else {
            fav = true;
            search = false;
            mainContent = <NewsFavContent getArticleSource={this.getArticleSource}/>
        }

        return (
            <div>
                <NewsNavbar fav={fav} search={search} nyTimesFlag={this.state.nyTimesFlag} getSource={this.getSource} activeSection={this.state.sectionCurrentLink}/>
                {mainContent}
            </div>
        );
    }

}


export default App;
