import React from 'react';
import {Row, Col, Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import Select from 'react-select';
import NewsSwitch from "./NewsSwitch";
import './styles.css'
import {IconContext} from 'react-icons'
import {FaRegBookmark} from 'react-icons/fa'


class NewsNavbar extends React.Component {
    state = {
        currentLink: 1
    }

    getSource = nyTimesFlag => {
        console.log("nyTimesFlag: " + nyTimesFlag);
        this.props.getSource(nyTimesFlag);
    };

    handleSelect = eventKey => {
        let links = ['home', 'home', 'world', 'politics', 'business', 'technology', 'sports'];
        this.setState({currentLink: eventKey});
        this.props.getLink(links[eventKey]);
    };

    render() {
        const scaryAnimals = [
            { label: "Alligators", value: 1 },
            { label: "Crocodiles", value: 2 },
            { label: "Sharks", value: 3 },
            { label: "Small crocodiles", value: 4 },
            { label: "Smallest crocodiles", value: 5 },
            { label: "Snakes", value: 6 },
        ];
        return (
            <Navbar className="navbar" expand="lg" bg="dark" variant="dark">
                <Col md={2}>
                    <Select
                        options={scaryAnimals}
                        placeholder={"Enter Keyword .."}
                    />
                </Col>

                <Col>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto" activeKey={this.state.currentLink} onSelect={this.handleSelect}>
                            <Nav.Link eventKey="1" href="#Home">Home</Nav.Link>
                            <Nav.Link eventKey="2" href="#World">World</Nav.Link>
                            <Nav.Link eventKey="3" href="#Politics">Politics</Nav.Link>
                            <Nav.Link eventKey="4" href="#Business">Business</Nav.Link>
                            <Nav.Link eventKey="5" href="#Technology">Technology</Nav.Link>
                            <Nav.Link eventKey="6" href="#Sports">Sports</Nav.Link>
                        </Nav>
                        <Nav>
                            <IconContext.Provider value={{ color: "white" }}>
                                <div className="bookmark">
                                    <FaRegBookmark />
                                </div>
                            </IconContext.Provider>
                            <span className="switchSpan">NYTimes</span>
                            <NewsSwitch getSource={this.getSource}/>
                            <span className="switchSpan">Guardian</span>

                        </Nav>
                    </Navbar.Collapse>

                </Col>


            </Navbar>



        );
    }

}

export default NewsNavbar;