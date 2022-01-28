import React, {useState, useEffect} from 'react'
import styles from './ErrorTooltip.module.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaExclamationCircle } from 'react-icons/fa';

const VERTICAL = 550

const ErrorTooltip = ({id, errorMsg}) => {
    const [position, setPosition] = useState('right');

    useEffect(() => {
        // Initialize display mode (vertical)
        setDisplayMode();
    }, [])

    function setDisplayMode(event) {
        if (window.innerWidth <= VERTICAL) {
            setPosition('left')
        } else {
            setPosition('right')
        }
    }

    return(
        <>
            <OverlayTrigger
                key={`${id}key`}
                placement={position}
                className='bcp-tooltip'
                overlay={
                    <Tooltip id={`tooltip-${id}`} className='bcp-tooltip'>
                        {errorMsg || 'There was an error with this field'}
                    </Tooltip>
                }
            >
                <FaExclamationCircle className={`${styles.error}`}/>
            </OverlayTrigger>
        </>
    )
}

export default ErrorTooltip