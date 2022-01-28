import React,{useState, useEffect} from 'react'
import styles from './EntryModal.module.css'
import './EntryModal.css'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import ErrorTooltip from '../../ErrorTooltip/ErrorTooltip';
import moment from 'moment'

const BLANK_ERRORS = []

// Modal to add an Entry into an Event
const AddEntryModal = ({show, setShowAddEntryModal, eventModalInfo, addEntry}) => {
    
    const [errors, setErrors] = useState([]); //list of errors
    const [entrySubmitted, setSubmit] = useState(false); //entry status
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(show){
          document.documentElement.style.overflow = 'hidden';
        }
        else{
          document.documentElement.style.overflow = 'auto';
        }

        return () => {document.documentElement.style.overflow = 'auto';}
    }, [show]);

    // Reset errors when an entry is submitted, or new eventModalInfo is opened
    useEffect(() => {
        setErrors(BLANK_ERRORS);
    }, [entrySubmitted, show]);

   
    // function to send an entry to the database
    const handleAddEntry = () => {
        setLoading(true);
        let entryName = document.getElementById('entryName').value;
        let entryId = document.getElementById('entryId').value;
    
        let entryObject = {
            entryName: entryName, 
            entryId: entryId,
            approved: false
        };
    
        addEntry(entryObject)
        setLoading(false);    
        setSubmit(true)  
    }

    const handleClose = () => {
        setShowAddEntryModal(false);
        setTimeout(()=> {
            setSubmit(false);
            setLoading(false);
        }, 500);
    }

    const clearError = (index) => {
        let copy = errors.slice();
        copy[index] = '';
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            className='dialog'
        >
            <Modal.Header closeButton>
            <Modal.Title>Add Entry to Event</Modal.Title>
            </Modal.Header>
            {entrySubmitted 
            ?
                <>
                <Modal.Body>
                    <p style={{fontWeight:'500'}}>Your entry has been submitted!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Okay
                    </Button>
                </Modal.Footer>
                </>
            :  
                <>
                <Modal.Body>
                    <p style={{fontSize: '18px'}}>Date: <span style={{color: 'black'}}>{moment(eventModalInfo.start).format('dddd M/D/YYYY')}</span></p>
                    <p style={{fontSize: '18px'}}>Time: <span style={{color: 'black'}}>{eventModalInfo.start.toLocaleTimeString()} - {eventModalInfo.end.toLocaleTimeString()}</span></p>
                    <Form id='requestForm'>
                            <p style={{marginBottom: '10px', fontSize: '18px'}}>Please fill out the form below: </p>
                            <Form.Group>
                            <div onFocus={()=>clearError(0)} style={{position: 'relative'}}>
                                <Form.Control  className = {``} id='entryName' placeholder="Entry Name" required/>
                            </div>
                            </Form.Group>
                            <Form.Group>
                            <div onFocus={()=>clearError(1)} style={{position: 'relative'}}>
                            <Form.Control className = {``} id='entryId' placeholder="Entry ID" required/>
                            </div>
                            </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className={styles.cancel} onClick={handleClose}>
                        Cancel
                    </Button>
                    {loading ?
                        <Button 
                            variant="primary" 
                            className={styles.subButton}
                            disabled
                            style={{minWidth: '83px'}}
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
                        <Button 
                            variant="primary" 
                            className={styles.subButton}
                            type='submit' 
                            onClick={function () {handleAddEntry()}}
                        >
                            Add
                        </Button>
                    }
                </Modal.Footer>
                </>
            }
        </Modal>
    )
}
export default AddEntryModal;