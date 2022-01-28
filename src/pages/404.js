import React from "react"
import 'animate.css/animate.css' 
import "../styles/global.css";
import styles from"../styles/404.module.css"

const NotFoundPage = () => (

    <div className={`${styles.page} d-flex justify-content-center`}>
      <div className={`${styles.bookContainer} d-flex justify-content-center`}>
      </div>
      <div className = {`${styles.content}`}>
        <h1 className={styles.animateContent} text = '404'> 404</h1>
        <h4 className={styles.animateContent} text = ''>Page Not Found</h4>
        
          
        <p>Sorry! The page you are looking for was either removed or never existed.</p>
        <a href = '/' className = {`${styles.link}`}>Take Me Home</a>
      </div>
    </div>  
  )


export default NotFoundPage