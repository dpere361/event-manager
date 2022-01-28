import { checkAuth } from '../api/api'

export function animateGeneral (flag, boundings) {
    // You have to add the anim-flag to a div that contains the thing you want to animate, this allows the fadeInUp to work
    let list = Array.from(document.getElementsByClassName(flag));

    for(var i = 0; i < list.length; ++i) {
        boundings[i] = list[i].getBoundingClientRect();

        // when the container enters the screen
        if(boundings[i].top - document.documentElement.clientHeight < 0) {
            // adds the necessary classes
            list[i].firstChild.classList.add('animate__animated', 'animate__fadeInUp', 'animate__faster');
        }
        // resets the animation if you scroll back up (The number is a pixel threshold of when the animation is able to reset)
        else if(boundings[i].top - document.documentElement.clientHeight > 100) {
            list[i].firstChild.classList.remove('animate__animated', 'animate__fadeInUp', 'animate__faster');
        }
    }
}
 
export const animateStaggered = (containerFlag, flag) => {

    // add an ID to the container that's holding everything
    let element = document.getElementById(containerFlag); 

    // Places all elements with the appropriate flag in list
    let list = Array.from(document.getElementsByClassName(flag));
    
    let isDone = false;

    const bounding = element.getBoundingClientRect();

    // if the top of the bounding box enters the bottom of the screen...
    if(bounding.top - document.documentElement.clientHeight < 0 && !isDone) {
        
        // adds the necessary classes to each column in list
        list.map((listitem)=> {
            listitem.classList.add('animate__animated', 'animate__fadeInUp', 'animate__faster');

        }) 
        isDone = true;
    }
    // resets the animation if you scroll above the container
    else if(bounding.top - document.documentElement.clientHeight > 0) {
        list.map((listitem)=> {
            listitem.classList.remove('animate__animated', 'animate__fadeInUp', 'animate__faster');
        }) 
    }
}

export function isElementInViewport (element, elbowRoom) {
    let rect = element.getBoundingClientRect()

    return (
        rect.top >= 0 - (elbowRoom || 0) &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + (elbowRoom || 0)
    )
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeLeadingZeroes(string) {
    return string.replace(/^0+/, '');
}

export const isLoggedIn = () => {
    
    return checkAuth()
    .then(res => {
        return res;
    })
    .catch(function (err) {
        console.log(err);
        return false;
        
    });

}

// Returns true if the passed string fits the valid name format, false otherwise
export const isValidName = async (str) => {
    return str.trim().indexOf(' ') != -1;
}