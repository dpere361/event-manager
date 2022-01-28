import React, {useState, useEffect} from 'react'
import styles from './Events.module.css'
import './Events.css'
import { Link } from 'gatsby'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import NewEventButton from '../NewEventButton/NewEventButton'
import { FaUser, FaSortUp, FaArrowLeft, FaAddressCard, FaSyncAlt, FaCheckCircle, FaAngleDoubleRight, FaAngleDoubleLeft, FaTimesCircle, FaFileExport } from 'react-icons/fa';
import { HiUserAdd } from 'react-icons/hi';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import AddEntryModal from './AddEntryModal.js'
import EventOptions from './EventOptions'
import { handleDownload } from '../../../utility/downloadCSV'
import {events} from "../../../../mock_data"

//Events Page Component
const Events = () => {

    const [submitted, setSubmit] = useState(false); //keeps track of when an event is submitted
    const [eventList, setList] = useState(events); //contains the list of events
    const [openEvent, setOpen] = useState(0); //index of the currently opened event
    const [extendedInfo, setExtendedInfo] = useState(false); // show/hide extended info
    const [approvalDisable, setApprovalDisable] = useState(false); // disable/enable approval button
    const [currentEvent, setCurrentEvent] = useState(null); // currently selected event object
    
    const [collapsed, setCollapsed] = useState(false) // show/hide events list

    //Delete states
    const [showDelete, setShowDelete] = useState(false);
    const [deletedEntry, setDeletedEntry] = useState(null);
    
    //Check states
    const [checked, setChecked] = useState([]); // keeps track of which checkbox has been clicked
    const [allChecked, setAllChecked] = useState([]); // used for number of checks in preview
    const [check, setCheck] = useState(0); // number of checked states

    // Show modals
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        
        initializeAllChecked();
        if(eventList.length > 0) {
            //If openEvent is greater than the amount of events
            if(openEvent >= eventList.length) {
                setOpen(eventList.length - 1)
            }
            else {
                setCurrentEvent(eventList[openEvent])
                let checked = eventList[openEvent].entries.slice().map((req) => req.approved);
                setChecked(checked);
            }
        }
    }, [eventList])

    useEffect(() => {
        if(eventList.length > 0) {
            let checked = eventList[openEvent].entries.slice().map((req) => req.approved);
            setChecked(checked);

            //Set current event info
            setCurrentEvent(eventList[openEvent]);
        }
        
    }, [openEvent])

    useEffect(() => {
        let count = 0;
        checked.forEach(check => check ? count++ : null);
        setCheck(count);
    }, [checked])

    const removeEvent = (eventEntry) => {
        let events = eventList.slice()
        const index = events.findIndex(e => e.name == eventEntry);
        console.log(index)
        if (index > -1) {
            events.splice(index, 1);
        }
        setList(events)
    }
    
    const removeEntry = () => {
        let events = eventList.slice()
        const eventIndex = events.indexOf(currentEvent);
        if (eventIndex > -1) {
            
            const entryIndex = events[eventIndex].entries.indexOf(deletedEntry)
            if (entryIndex > -1) 
                events[eventIndex].entries.splice(entryIndex, 1);
        }
        setList(events)
    }

    const addEntry = (entry) => {
        
        let events = eventList.slice()
        const eventIndex = events.indexOf(currentEvent);
        if (eventIndex > -1) {
            events[eventIndex].entries.push(entry)
        }
        setList(events)
    }

    const addEvent = (eventEntry) => {
        let events = eventList.slice()
        events.push(eventEntry)
        setList(events)
    }

    // function to fetch the list of events from the database
    function getList() {
        setList(events.slice())
        initializeAllChecked();
    }

    // Function to push approvals to the database
    const submitApproval = () => {
        setApprovalDisable(true);
        let tempEntries = eventList[openEvent].entries.slice();

        //Change the approvals in the tempEntries object
        for(var i = 0; i < tempEntries.length; i++) {
            if(checked[i]){
                tempEntries[i].approved = true;
            }
        }

        let eventObject = {
            entries: tempEntries,
            name: eventList[openEvent].name, 
            description: eventList[openEvent].description, 
            date: eventList[openEvent].date,
            entriesMax: eventList[openEvent].entriesMax
        }

        let events = eventList.slice()
        const eventIndex = events.indexOf(currentEvent);
        if (eventIndex > -1) {
            events[eventIndex] = eventObject
        }
        setList(events)
        setApprovalDisable(false);
    }

    function handleCheck(e, index) {
        let newChecked = checked.slice();
        newChecked[index] = e.target.checked;
        setChecked(newChecked);
    }

    function handleConfirmClose() {
        setShowConfirmation(false);
    }

    function handleDisapproveClose() {
        setShowDelete(false);
        setDeletedEntry(null);
    }

    const initializeAllChecked = () => {
        let checkedList = [];
        for(var i = 0; i < eventList.length; i++) {
            let count = 0;
            eventList[i].entries.slice().map((req) => {if(req.approved) {count++}});
            checkedList[i] = count;
        }
        setAllChecked(checkedList)
    }

    const handleCollapse = () => {
        if(!collapsed) {
            document.getElementById("collapsible").style.display = "none";
            setCollapsed(true);
        }
        else{
            document.getElementById("collapsible").style.display = "block";
            setCollapsed(false);
        }
    }

    const handleDisapprove = () => {
        removeEntry()
    }

    const ConfirmationModal = () => {
        return(
            <Modal
                show={showConfirmation}
                onHide={handleConfirmClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Body>
                    <p>Are you sure you want to confirm approvals?</p>
                    <p style={{color: '#2041d2'}}>Total number of approvals: {check} / 
                    {eventList.length > 0 && currentEvent? currentEvent.entriesMax : '20'}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className={styles.newButton} onClick={() => {
                        handleConfirmClose();
                        submitApproval();
                    }}>
                        Submit
                    </Button>
                <Button variant="secondary" onClick={handleConfirmClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const DisapproveConfirmationModal = () => {
        return(
            <Modal
                    show={showDelete}
                    onHide={handleDisapproveClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Body>
                        <p>Are you sure you want to delete this entry?</p>
                        <p>Name: {deletedEntry?.entryName}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            handleDisapproveClose();
                            handleDisapprove();
                        }}>
                            Submit
                        </Button>
                    <Button variant="secondary" onClick={handleDisapproveClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
        )
    }

    return(
    <div className={`${styles.page} d-flex justify-content-center align-items-center`}>
    <ConfirmationModal/>
    <DisapproveConfirmationModal/>
    <Tab.Container id="event-tabs" defaultActiveKey={openEvent}>
        <div className={styles.collapsible} >
            {collapsed
            ? <div className={styles.collapseTab} onClick={handleCollapse}><FaAngleDoubleRight style={{width:'80%', height: 'auto'}}/></div>
            : <div className={styles.collapseTab} onClick={handleCollapse}><FaAngleDoubleLeft style={{width:'80%', height: 'auto'}}/></div>
            }
            
        <ResizableBox 
            width={350} 
            height={window.innerHeight}
            minConstraints={[230, 300]}
            maxConstraints={[600, Infinity]}
            handle= {<span className={styles.resizer}>
                        {<FaSortUp style={{color: 'grey', paddingTop: '5px', transform: 'rotate(90deg)', fontSize: '20px', width: '20px'}}/>}
                    </span>}
            resizeHandles={['e']}
            axis={'x'}
            id='collapsible'
        >
        <div className={`${styles.eventsDiv}`}>
            <div className={styles.homeLink}>
                <Link to="/portal/home"><FaArrowLeft style={{width: 15, height: 15, marginBottom: 3, fontWeight: 600}} /> Back to Home</Link>
            </div>
            <NewEventButton setSubmit={setSubmit} submitted={submitted}  eventList={eventList} addEvent={addEvent}></NewEventButton>
            <h3>Events</h3>
            <div className={styles.eventList}>
                <Nav variant="pills" className="flex-column">
                    {eventList.map((item, i) => { 
                        let itemDate = new Date(item.date.start);
                        return (
                            <Nav.Item key={"nav" + i}>
                                <Nav.Link eventKey={i} onClick={() => setOpen(i)} className='d-flex justify-content-between' active={openEvent == i}>
                                    <div style={{width: '100%'}}>
                                        <div className='d-flex align-items-center'>
                                        
                                            <div style={{width: '100%'}}>
                                                <div className='d-flex justify-content-between'>
                                                    {item.name}
                                                    <div className='d-flex' style={{fontWeight:'400', color: '#2041d2', marginBottom: '0px', marginLeft: '20px', whiteSpace: 'nowrap'}}> 
                                                        
                                                        <p style={{fontWeight:'400', color: '#2041d2', marginBottom: '0px', whiteSpace: 'nowrap'}}>
                                                            <FaUser className={styles.icon} style={{fontSize: '14px'}}/> {item.entries.slice().length}
                                                        </p>
                                                        <p style={{fontWeight:'400', color: '#2041d2', marginBottom: '0px', marginLeft: '8px', whiteSpace: 'nowrap'}}>
                                                            <FaCheckCircle className={styles.icon} style={{fontSize: '15px'}}/> {allChecked[i]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <p style={{marginBottom: '0px'}}>({itemDate.getMonth()+1}/{itemDate.getDate()}/{itemDate.getFullYear()})</p>
                                                    <EventOptions eventInfo={item} getList={getList} removeEvent={removeEvent}></EventOptions>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Nav.Link> 
                            </Nav.Item>
                        )
                    })}
                </Nav>
            </div>
        </div>
        </ResizableBox>
        </div>
        <div className={`${styles.entriesDiv}`}>
            <div className={styles.entriesCard}>
                <div className={`d-flex justify-content-between align-items-center ${styles.mainHeaderDiv}`} >
                    <div style={{width: '15px'}}></div> {/*Quick way of centering the heading*/}
                    <h3 className={styles.entriesHeading} style={{marginBottom: 0}}>
                        
                        {currentEvent 
                        ? 
                            (currentEvent.entriesMax 
                            ?
                                `${new Date(currentEvent.date.start).getMonth()+1}/${new Date(currentEvent.date.start).getDate()}/${new Date(currentEvent.date.start).getFullYear()} |
                                ${new Date(currentEvent.date.start).toLocaleTimeString()} |
                                ${currentEvent.name} (${check} / ${currentEvent.entriesMax} Approved)` 
                            :
                                `${new Date(currentEvent.date.start).getMonth()+1}/${new Date(currentEvent.date.start).getDate()}/${new Date(currentEvent.date.start).getFullYear()} |
                                ${new Date(currentEvent.date.start).toLocaleTimeString()} |
                                ${currentEvent.name} (${check} / 20 Approved)` 
                            )
                        :   
                            'Loading Entries...'
                        }
                    </h3>
                    <div className='d-flex'>
                        <div className={styles.optionsContainer}  style={{marginRight: '5px'}}>
                            <div>
                                <OverlayTrigger className="bcp-tooltip" placement='top' overlay={<Tooltip className="bcp-tooltip">Refresh</Tooltip>}>
                                    <button type="button" className={styles.optionalButton} onClick={() => alert('Refresh failed, try connecting to a database')}>
                                        <FaSyncAlt style={{color: "#2041d2", width: 24, height: 24}}></FaSyncAlt>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className={styles.optionsContainer} style={{marginRight: '5px'}}>
                            <div>
                                {!extendedInfo ?
                                    <OverlayTrigger className="bcp-tooltip" placement='top' overlay={<Tooltip className="bcp-tooltip">Show Entry ID</Tooltip>}>
                                        <button type="button" className={styles.optionalButton} onClick={() => setExtendedInfo(true)}>
                                            <FaAddressCard style={{color: "#2041d2", width: 24, height: 24}}></FaAddressCard>
                                        </button>
                                    </OverlayTrigger>
                                :
                                    <OverlayTrigger className="bcp-tooltip" placement='top' overlay={<Tooltip className="bcp-tooltip">Hide Entry ID</Tooltip>}>
                                        <button type="button" className={styles.optionalButtonPressed} onClick={() => setExtendedInfo(false)}>
                                            <FaAddressCard style={{color: "#2041d2", width: 24, height: 24}}></FaAddressCard>
                                        </button>
                                    </OverlayTrigger>
                                }
                            </div>
                        </div>
                        <div className={styles.optionsContainer} style={{marginRight: '5px'}}>
                            <div>
                                <OverlayTrigger className="bcp-tooltip" placement='top' overlay={<Tooltip className="bcp-tooltip">Add Entry</Tooltip>}>
                                    <button type="button" className={styles.optionalButton} onClick={() => setShowAddEntryModal(true)}>
                                        <HiUserAdd style={{color: "#2041d2", width: 24, height: 24}}></HiUserAdd>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className={styles.optionsContainer}>
                            <div>
                                <OverlayTrigger className="bcp-tooltip" placement='top' overlay={<Tooltip className="bcp-tooltip">Export to Text</Tooltip>}>
                                    <button type="button" className={styles.optionalButton} onClick={() => handleDownload(eventList[openEvent], 'singleEvent')}>
                                        <FaFileExport style={{color: "#2041d2", width: 24, height: 24}}></FaFileExport>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.entriesList}>
                    <Tab.Content>
                        {eventList.map((e, i) => {return (
                            <Tab.Pane eventKey={i} key={i}>
                                <Form>
                                    <div className='event-info-table-container'>
                                    <Table hover size="sm" className='event-info-table'>
                                        <thead>
                                            <tr>
                                            <th>#</th>
                                            <th>Approved</th>
                                            
                                            <th>Name</th>
                                            {extendedInfo?
                                            <>
                                                <th>ID</th>
                                            </>
                                            : null
                                            }
                                            <th style={{textAlign: 'center'}}>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {e.entries.slice().map((entry, j) => {return (
                                            <tr key={i + "-" + j}>
                                            <td>{j + 1}</td>
                                            <td>
                                                <input className={`${styles.check} form-check-input Nav${i}-checkbox`} type="checkbox" id={`Nav${i}-req${j}`}
                                                    checked={checked[j] !== undefined ? checked[j] : ""} 
                                                    readOnly={entry.approved} 
                                                    disabled={entry.approved} 
                                                    onChange={(e) => handleCheck(e, j)}
                                                />
                                            </td>
                                            
                                            <td>
                                                <label className="form-check-label" htmlFor={`Nav${i}-req${j}`}>
                                                    {entry.entryName}
                                                </label>
                                            </td>
                                            {extendedInfo
                                            ? <td>{entry.entryId}</td>
                                            : null 
                                            } 
                                            
                                            {entry.approved
                                            ? <td style={{textAlign: 'center', color: 'grey'}}><FaTimesCircle/></td>
                                            : <td style={{textAlign: 'center', color: '#2041d2'}}><a onClick={()=>{setShowDelete(true); setDeletedEntry(entry)}}><FaTimesCircle/></a></td>
                                            }
                                            </tr>
                                        )})}
                                        </tbody>
                                    </Table>


                                    </div>
                                </Form>
                            </Tab.Pane>
                        )})}
                    </Tab.Content>
                </div>
                <div className={`d-flex justify-content-end align-items-center ${styles.mainFooterDiv}`}>
                    {approvalDisable
                    ? <Button disabled style={{height: '40px', marginRight:'10px', marginTop: '10px'}} className={styles.newButton}>Submit Approvals</Button>
                    : <Button style={{height: '40px', marginRight:'10px', marginTop: '10px'}} className={styles.newButton} onClick={() => setShowConfirmation(true)}>Submit Approvals</Button>
                    }
                    
                </div>
            </div>
        </div>
        {currentEvent && <AddEntryModal 
            show={showAddEntryModal} 
            setShowAddEntryModal={setShowAddEntryModal} 
            eventModalInfo={{
                start: new Date(currentEvent.date.start),
                end: new Date(currentEvent.date.end),
                title: currentEvent.name,
                desc: currentEvent.description,
                id: currentEvent._id,
                ...currentEvent
            }}
            addEntry={addEntry}
        ></AddEntryModal>}
    </Tab.Container>
    </div>
    )
}

export default Events;