import React, {useState} from 'react';
import styles from './Events.module.css';
import './Events.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button';
import {FaEllipsisH} from 'react-icons/fa';
import { Modal } from 'react-bootstrap';

//Component for event options dropdown menu
const EventOptions = ({eventInfo, getList, removeEvent}) => {

    const [showDelete, setShowDelete] = useState(false);

    return(
        <>
        <Dropdown>
            <Dropdown.Toggle as={CustomDropdown}></Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as={CustomItem} onClick={() => {setShowDelete(true)}}>Delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        
        <DeleteModal eventInfo={eventInfo} showDelete={showDelete} setShowDelete={setShowDelete} getList={getList} removeEvent={removeEvent}/>
        </>
    )
}
export default EventOptions

const DeleteModal = ({eventInfo, showDelete, setShowDelete,removeEvent}) => {
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const handleDelete = () => {
        setLoading(true);
        removeEvent(eventInfo.name)
        setLoading(false);
        setDeleted(true);
    }

    const handleCloseDelete = () => {
        setShowDelete(false);
        setTimeout(()=> {
            setLoading(false);
            setDeleted(false);
        }, 500);
    }

    return (
        <>
        <Modal
            show={showDelete}
            onHide={handleCloseDelete}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Body>
                {!deleted 
                ? 
                    <>
                    <p>Are you sure you want to delete {eventInfo.name}?</p>
                    <p>Date: {`${new Date(eventInfo.date.start).getMonth()+1}/${new Date(eventInfo.date.start).getDate()}/${new Date(eventInfo.date.start).getFullYear()}`}</p>
                    <p>Time: {`${new Date(eventInfo.date.start).toLocaleTimeString()}`}</p>
                    <p style={{color: '#2041d2'}}>Number of Requests: {eventInfo.entries.length}</p>
                    </>
                : `Event successfully deleted`
                }
            </Modal.Body>
            <Modal.Footer>
                {deleted 
                ?   null
                : 
                    (loading ? 
                        <Button 
                            variant="primary"
                            disabled
                            style={{minWidth: '79px'}}
                        >
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </Button>
                    :
                        <Button variant="danger" onClick={() => handleDelete(eventInfo.name)}>
                            Delete
                        </Button>
                    )
                }
            <Button variant="secondary" onClick={handleCloseDelete}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

const CustomDropdown = React.forwardRef(({onClick}, ref) => (
    <div
        href=''
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e)
        }}
        className={styles.menuOptions}
    >
        <FaEllipsisH/>
    </div>
));

const CustomItem = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy, onClick }, ref) => {
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
          onClick = {onClick}
        >
          {children}
        </div>
      ); 
    },
);

