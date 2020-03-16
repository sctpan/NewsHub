import React from 'react';
import {Row, Col, Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import Select from 'react-select';
import MySwitch from "./MySwitch";
import './styles.css'
import {IconContext} from 'react-icons'
import {FaRegBookmark} from 'react-icons/fa'


class MyNavbar extends React.Component {

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
                        <Nav className="mr-auto">
                            <Nav.Link href="#Home">Home</Nav.Link>
                            <Nav.Link href="#World">World</Nav.Link>
                            <Nav.Link href="#Politics">Politics</Nav.Link>
                            <Nav.Link href="#Business">Business</Nav.Link>
                            <Nav.Link href="#Technology">Technology</Nav.Link>
                            <Nav.Link href="#Sports">Sports</Nav.Link>
                        </Nav>
                        <Nav>
                            <IconContext.Provider value={{ color: "white" }}>
                                <div className="bookmark">
                                    <FaRegBookmark />
                                </div>
                            </IconContext.Provider>
                            <span className="switchSpan">NYTimes</span>
                            <MySwitch/>
                            <span className="switchSpan">Guardian</span>

                        </Nav>
                    </Navbar.Collapse>

                </Col>


            </Navbar>



        );
    }

}

export default MyNavbar;