/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'bootstrap/dist/css/bootstrap.min.css';

// in gastby-browser.js
export const onInitialClientRender = () => {
  console.log('rendering...')
	window.scrollTo(0, 0);
};

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
    console.log(location)
    if (location.hash === '') {
        // window.scrollTo(0, 0);
        return [0, 0];
    }
    else {
        console.log(location.hash)
        let id = location.hash.split("#")[1];
        setTimeout(() => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth"});  
        }, 300)
        
        return location.hash.split("#")[1];
    }

    return false;
};
