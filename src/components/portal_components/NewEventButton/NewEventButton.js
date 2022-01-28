import React,{useState, useEffect} from 'react'
import styles from './NewEventButton.module.css'
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-bootstrap/Modal'
import DatePicker from "react-datepicker"
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ErrorTooltip from '../../ErrorTooltip/ErrorTooltip';
import moment from 'moment';

const DEFAULT_START_TIME = moment({ hour:9, minute:0 });
const DEFAULT_END_TIME = moment({ hour:12, minute:30 });


// Component
const NewEventButton = ({setSubmit, submitted, addEvent}) => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [eventDate, setDate] = useState(new Date());
    const [startTime, setStart] = useState(DEFAULT_START_TIME); // modal start date
    const [endTime, setEnd] = useState(DEFAULT_END_TIME); // modal end date
    const [show, setShow] = useState(false); // modal status
    const [errors, setErrors] = useState([]); // list of errors


    // When start time is selected, end time updates to the same day +5 Hours
    useEffect(() => {
        let newEnd = new Date(startTime);
        newEnd.setHours( newEnd.getHours() + 5);
        setEnd(newEnd);
    }, [startTime]);

    const handleCreate = () => {
        let name = document.getElementById('name').value;
        let description = document.getElementById('desc').value;
        let max;
        if(max = document.getElementById('max').value === '')
            max = undefined;
        else
            max = document.getElementById('max').value
    
        let date = {
            start: new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                moment(startTime).hour(),
                moment(startTime).minute(),
                0, 0
            ),
            end: new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                moment(endTime).hour(),
                moment(endTime).minute(),
                0, 0
            ),
        }

        let eventObject = {
            entries: [],
            name: name, 
            description: description, 
            date: date,
            entriesMax: max
        };

        addEvent(eventObject)
        setSubmit(true)
    }

    const handleDateChange = date => {
        setDate(date);
    }
    const handleStartChange = date => {
        setStart(date);
    };
    const handleEndChange = date => {
        setEnd(date);
    };

    //closes modal and resets dates
    const handleClose = () => {
        setName('');
        setDesc('');
        setShow(false);
        setStart(DEFAULT_START_TIME);
        setEnd(DEFAULT_END_TIME);
        setTimeout(()=> {setSubmit(false)}, 500); // stops info from changing before closing animation finishes
    }

    const handleShow = () => {
        setShow(true);
    }


    // clears the error from a single form, using the form's index
    const clearError = (index) => {
        let copy = errors.slice();
        copy[index] = '';
        setErrors(copy);
    }
    
    return (
        <>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title>Create a New Event</Modal.Title>
            </Modal.Header>
            {submitted 
            ?(
                <><Modal.Body>
                <p style={{fontWeight:'500'}}>Event has been created</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Okay
                </Button>
                </Modal.Footer></>
            )
            :(
                <>
                <Modal.Body>
                <Form id='requestForm'>
                    <Form.Group>
                    <div onFocus={()=>clearError(0)} style={{position: 'relative'}}>
                        <Form.Control defaultValue={name} className = {``} id='name' placeholder="Name" required/>
                    </div>
                    </Form.Group>
                    <Form.Group>
                    <div onFocus={()=>clearError(1)} style={{position: 'relative'}}>
                        <Form.Control defaultValue={desc} className = {``} id='desc' placeholder="Description" required/>
                    </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control className = {``} id='max' placeholder="Max Entries (Default 20)"/>
                    </Form.Group>
                    <Form.Group className='d-flex'>
                        <p style={{marginRight: '10px', marginTop: 'auto', marginBottom: 'auto', fontSize: '20px'}}>Date: </p>
                        <DatePicker
                            className={styles.dayPicker}
                            id='date'
                            selected={eventDate}
                            onChange={(date) => {handleDateChange(date)}}
                            dateFormat="MM/dd/yyyy"
                        />
                    </Form.Group>
                    <div onFocus={()=>clearError(2)} style={{position: 'relative'}}>
                
                        <Form.Group className='d-flex'>
                            <p style={{marginBottom: 'auto', marginTop: 'auto', marginRight: '10px', fontSize: '20px'}}>Time: </p>
                            <TimePicker 
                                className='timePicker'
                                use12Hours 
                                showSecond = {false} 
                                format = 'h:mm a' 
                                placeholder = 'Start' 
                                value = {moment(startTime)} 
                                minuteStep = {15} 
                                onChange = {(time)=>handleStartChange(time)}
                            />
                            <p style={{margin: 'auto 5px auto 5px', fontWeight: '600'}}> - </p>
                            <TimePicker
                                className='timePicker'
                                use12Hours 
                                showSecond = {false} 
                                format = 'h:mm a' 
                                placeholder = 'End' 
                                value = {moment(endTime)}  
                                minuteStep = {15} 
                                onChange = {(time)=>handleEndChange(time)}
                            />
                        </Form.Group>
                    </div>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" className={styles.subButton}type='submit' onClick={function () {handleCreate(setSubmit, setErrors);}}>Create</Button>
                </Modal.Footer></>
            )
            }
        </Modal>
        <Button className={styles.newButton} onClick={handleShow}>Create Event</Button>
        </>
    )
}

export default NewEventButton;