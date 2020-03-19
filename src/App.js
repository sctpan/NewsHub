import React,  { useState } from 'react';
import './App.css';
import NewsNavbar from './NewsNavbar';
import NewsContent from "./NewsContent";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            source: false,
            currentLink: 'home'
        }
    }


    getSource = nyTimesFlag => {
        this.setState({
            source: nyTimesFlag
        });
    }

    getLink = currentLink => {
        this.setState({
            currentLink: currentLink
        })
    }

    render() {
        return (
            <div>
                <NewsNavbar getSource={this.getSource} getLink={this.getLink}/>
                <NewsContent nyTimesFlag={this.state.source} currentLink={this.state.currentLink}/>
            </div>
        );
    }


}


export default App;
