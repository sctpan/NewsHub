import React from 'react'
import './styles.css'
import {Row, Col, Container, Badge} from 'react-bootstrap'
import test from './test.jpg'

class NewsBar extends React.Component {
    render() {
        return (
            <div className="newsbar">
                <Row>
                    <Col md="auto">
                        <img src={test} className="news-image"/>
                    </Col>
                    <Col>
                        <div className="news-title">
                            Summary: Wall Street tumbles on another bad day
                        </div>
                        <div className="news-description">
                            Time for a quick recap. Wall Street has suffered its biggest drop since the coronavirus crisis began, as global markets suffered another day of very hefty losses. Heavy selling sent the S%P 500 plunging by 12%, to its lowest level since December 2018, as investors lost faith that politicians and central bankers can prevent a deep recession. The Dow Jones industrial average slumped by 13% (losing almost 3,000 points), in its second-worse points decline ever. Asia-Pacific markets could pick up the selling baton, with Australia’s S&P ASX index being called down 4% in pre-market trading. The selloff came as President Donald Trump conceded that America’s economy could be falling into recession, and suggested Covid-19 could not be under control until August. It also followed another emergency interest rate cut by the US Federal Reserve, which lowered borrowing costs to almost zero and teamed up with other central banks to create new swap lines to give easier access to dollars. The slump means that the Dow has lost almost 30% of its value this year. There were heavy losses in Europe too, where the FTSE 100 dropped 4% to an eight year low. The Footsie fell below 5,000 points at one stage, and has also lost some 30% of its value in 2020.\nInvestors were spooked by signs that Europe’s economy is going into recession, with Italy, Spain and France now on lockdown. In the UK, prime minister Boris Johnson advised people to work from home where possible and to avoid pubs, clubs and theatres: Johnson unveiled a series of hugely stringent new restrictions to slow what he said was the now-rapid spread of coronavirus in the UK, including a 14-day isolation for all households with symptoms, a warning against “non-essential” contact, and an end to all mass gatherings.\nAirlines led the rout in London today, with several - including British Airways parent firm IAG and budget airline easyJet - announcing they were grounding their fleets and cancelling flights. Analysts fear many will have collapsed by May
                        </div>
                        <div className="news-info">
                            <span className="news-time">2020-03-07</span>
                            <Badge className="news-category" variant="primary">BUSINESS</Badge>
                        </div>
                    </Col>

                </Row>

            </div>
        );
    }
}

export default NewsBar;