import React from 'react';
import {Row, Col, Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import SearchBox from "./SearchBox";
import AsyncSearchBox from "./AsyncSearchBox";
import NewsSwitch from "./NewsSwitch";
import './styles.css'
import {IconContext} from 'react-icons'
import {FaRegBookmark, FaBookmark} from 'react-icons/fa'
import ReactTooltip from "react-tooltip";


class NewsNavbar extends React.Component {
    getSource = nyTimesFlag => {
        console.log("nyTimesFlag: " + nyTimesFlag);
        this.props.getSource(nyTimesFlag);
    };

    getSectionKey = section => {
        let links = {'home': 1, 'world': 2, 'politics': 3, 'business': 4, 'technology': 5, 'sports': 6};
        if(!links.hasOwnProperty(section)) {
            return -1;
        }
        return links[section];
    };

    handleChange = () => {
        ReactTooltip.hide();
        if(this.props.fav) {
            window.location.href = '#/Home';
        } else {
            window.location.href = '#/favorites';
        }
    };

    render() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let bookmark = this.props.fav ? <FaBookmark   size={22}/> : <FaRegBookmark  size={22}/>;
        let newsSwitch = <>
            <span className="switchSpan">NYTimes</span>
            <NewsSwitch nyTimesFlag={this.props.nyTimesFlag} getSource={this.getSource}/>
            <span className="switchSpan">Guardian</span>
        </>;
        if(this.getSectionKey(this.props.activeSection) == -1) {
            newsSwitch = null
        }
        return (
            <Navbar className="navbar" expand="lg" bg="dark" variant="dark">
                <ReactTooltip id="bookmark" disable={isMobile} effect="solid" place="bottom" className="tooltip"/>

                <AsyncSearchBox refresh={this.props.search}/>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto" activeKey={this.getSectionKey(this.props.activeSection)}>
                            <Nav.Link eventKey="1" href="#/Home">Home</Nav.Link>
                            <Nav.Link eventKey="2" href="#/World">World</Nav.Link>
                            <Nav.Link eventKey="3" href="#/Politics">Politics</Nav.Link>
                            <Nav.Link eventKey="4" href="#/Business">Business</Nav.Link>
                            <Nav.Link eventKey="5" href="#/Technology">Technology</Nav.Link>
                            <Nav.Link eventKey="6" href="#/Sports">Sports</Nav.Link>
                        </Nav>
                        <Nav>
                            <IconContext.Provider value={{ color: "white" }}>
                                <div  className="bookmark" onClick={this.handleChange}>
                                    <span data-tip="Bookmark" data-for="bookmark">
                                        {bookmark}
                                    </span>



                                </div>
                            </IconContext.Provider>
                            {newsSwitch}

                        </Nav>
                    </Navbar.Collapse>




            </Navbar>



        );
    }

}

export default NewsNavbar;