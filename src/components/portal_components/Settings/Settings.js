import React, { useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import styles from './Settings.module.css'
import UsersTab from './Users/UsersTab';

const generalTabs = [];
const tutorTabs = [];
const adminTabs = ['Users'];

// Component
const Settings = ({ show, setShow, user }) => {
    const [currentTab, setCurrentTab] = useState(null);
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        let t = [...generalTabs];
        if(user.role === 'ADMIN') {
            t = [...t, ...adminTabs];
            setTabs(t);
        }
        else if (user.role === 'TUTOR') {
            t = [...t, ...tutorTabs];
            setTabs(t);    
        }

        if(t.length > 0) 
            setCurrentTab(t[0]);
    }, [])

    useEffect(() => {
        if(show){
          document.documentElement.style.overflow = 'hidden';
        }
        else{
          document.documentElement.style.overflow = 'auto';
        }

        return () => {document.documentElement.style.overflow = 'auto';}
    }, [show]);

    const handleClose = () => {
        setShow(false);
    }

    const renderTabs = () => {
        return tabs.map((tab) => {
            return ( 
                <div key={tab} className={`${styles.tab} ${currentTab === tab ? 'active' : ''}`} onClick={() => setCurrentTab(tab)} > 
                    {tab}
                </div>
            )
        })
    }

    const renderTabContent = (tab) => {
        switch(tab) {
            case 'Users': 
                return <UsersTab />
            default:
                return <p>There are currently no settings for you to access.</p>
            
        }
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop={"static"}
            keyboard={false}
            dialogClassName={styles.modal}
            size={"lg"}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            {/* Desktop */}
            <Modal.Body>
                <div className={styles.modalContentContainer}>
                    <div className={styles.modalTabs}>
                        {renderTabs()}
                    </div>
                    <div className={styles.tabContent}>
                        {renderTabContent(currentTab)}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default Settings;
