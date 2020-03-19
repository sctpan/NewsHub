import React,  { useState } from 'react';
import './App.css';
import NewsNavbar from './NewsNavbar';
import NewsContent from "./NewsContent";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            nyTimesFlag: true,
            currentLink: 'home'
        }
    }


    getSource = nyTimesFlag => {
        this.setState({
            nyTimesFlag: nyTimesFlag
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
                <NewsContent nyTimesFlag={this.state.nyTimesFlag} currentLink={this.state.currentLink}/>
            </div>
        );
    }


}


export default App;
