import React,  { useState } from 'react';
import './App.css';
import NewsNavbar from './NewsNavbar';
import NewsContent from "./NewsContent";
import ArticleDetail from './ArticleDetail'

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            nyTimesFlag: true,
            sectionCurrentLink: 'home',
            articleCurrentLink: null
        }
    }


    getSource = nyTimesFlag => {
        this.setState({
            nyTimesFlag: nyTimesFlag
        });
    };

    getRoute = route => {
        console.log(route);
        let sections = new Set(['Home', 'World', 'Politics', 'Business', 'Technology', 'Sports']);
        if(sections.has(route)) {
            this.setState({
                sectionCurrentLink: route.toLowerCase(),
                articleCurrentLink: null
            })
        } else {
            if(route.indexOf('?') !== -1) {
                let action = route.substr(0, route.indexOf('?'));
                if(action === 'article') {
                    this.setState({
                        articleCurrentLink: route.substr(route.indexOf('='))
                    });
                } else if(action === 'search') {
                    this.setState({
                        articleCurrentLink: null
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
        if(this.state.articleCurrentLink == null) {
            mainContent = <NewsContent nyTimesFlag={this.state.nyTimesFlag} currentLink={this.state.sectionCurrentLink}/>
        } else {
            mainContent = <ArticleDetail currentLink={this.state.articleCurrentLink}/>
        }



        return (
            <div>
                <NewsNavbar getSource={this.getSource} activeSection={this.state.sectionCurrentLink}/>
                {mainContent}
            </div>
        );
    }


}


export default App;
