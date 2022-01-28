import React, {useState, useEffect} from 'react'
import styles from"../styles/portal.module.css"
import { Router, redirectTo  } from "@reach/router"
import { Link } from 'gatsby'
import 'animate.css/animate.css' 
import Helmet from 'react-helmet';
import Events from '../components/portal_components/Events/Events';



const PortalPage = ({location}) => {
    return (
        <div>
            <Helmet >
                <meta charSet="utf-8" />
                <title>Events Manager</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
            </Helmet>
            <Router basepath="/portal">
                <Events path='/events' />
                <NotFound default />
            </Router>
        </div>
    )
}

export default PortalPage

const NotFound = () => {
    return (
      <div className={`${styles.page} d-flex justify-content-center align-items-center`}>
        <p className={styles.generalText}>It seems you've lost your way. <Link to="/portal/events" className={styles.link}>Events</Link>.</p>
      </div>
    )
}

const CloseWindow = () => {
    window.close();
    return (<></>)
}