import React, { useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styles from '../Settings.module.css'
import { getAllUsers, updateUser, generateNewUserLink } from '../../../../api/api'
import { FaArrowRight, FaArrowLeft, FaClipboard } from 'react-icons/fa';


const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(null);
    useEffect(() => {
        // Get users from API
        getAllUsers().then(res => {
            setUsers(res.data);
        })
    }, []);

    useEffect(() => {
        console.log(page)
        //If the page changes back to null, get all users again
        if(page == null) {
            getAllUsers().then(res => {
                setUsers(res.data);
            })
        }
    }, [page])

    function displayUsers() {
        console.log(users);
        return users ? users.map((user, index) => {
            return (
                <div className={`d-flex ${styles.gridRow}`} key={index}  onClick={() => {
                    setCurrentUser(user);
                    setPage("detail");
                }}>
                     <Row style={{flex: 1}}>
                        <Col lg={8}>{user.email}</Col>
                        <Col as={"b"}>{user.role}</Col>
                    </Row>
                    
                    <FaArrowRight size={18} style={{color: "var(--bcp-dark-gray)"}}/>
                </div>
               
            )
        }) : [];
    }

    function renderPage() {
        switch(page) {
            case null:
                return (
                    <div>
                        <Button 
                        type="button" 
                        className={styles.bcpButton} 
                        style={{ margin:'10px 0px', width: '100%'}} 
                        onClick={() => setPage("newuser")}
                        >Create New User</Button>
                    
                        <div className={styles.usersGrid}>
                            {displayUsers()}
                        </div>
                    </div>
                )
            case "detail":
                return <UserDetail user={currentUser} setPage={setPage}/>
            case "newuser":
                return <AddNewUser setPage={setPage} />
            default:
                return null;
        }
    }

    return (
        <>
           {renderPage()}
        </>
    )
}

export default UsersTab;

const UserDetail = ({user, setPage}) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);

    const submitChange = (e) => {
        e.preventDefault();
        let data = {
            ...user,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
        }

        updateUser(user._id, data).then(res => {
            alert(res.message);

            setPage(null)
        })
        .catch(err => {
            if(err.response.data) {
                alert(err.response.data.message)
            }
            else {
                alert("There was an error updating your user.")
            }
            
        })
    }

    return (
        <div>
            <div className={styles.backLink} onClick={() => setPage(null)}>
                <span><FaArrowLeft style={{width: 15, height: 15, marginBottom: 3, fontWeight: 600}} /> Back to Users</span>
            </div>

            <h4>{user.email}</h4>
            <hr></hr>
            <Form id='contact' onSubmit={(e) => submitChange(e)}>
                
                    <Col xs = {12}>
                        <Form.Label>First Name</Form.Label>
                        <Form.Group>
                            <Form.Control type="text" name='First Name' placeholder="First Name" 
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col xs = {12}>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Group>
                            <Form.Control type="text"  name='Last Name' placeholder="Last Name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}/>
                        </Form.Group>
                    </Col>
                

                
                    <Col xs = {12}>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Group>
                            <Form.Control name='E-mail' type="email" placeholder="E-mail" required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col xs = {12}>
                        <Form.Group>
                            <Form.Label>Role</Form.Label>
                            <Form.Control as={"select"} name='Role' type="text" placeholder="Role" required
                            value={role}
                            onChange={(event) => setRole(event.target.value)}>
                                <option>ADMIN</option>
                                <option>TUTOR</option>
                                <option>USER</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                

                {/* <Row className='justify-content-end'> */}
                    <Col xs={6} sm={3} >
                        <Button type='submit' className={styles.bcpButton} >Update</Button>    
                    </Col>
                {/* </Row> */}
            </Form>
       
        </div>
    )
}

const AddNewUser = ({ setPage }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("USER");
    
    const [submitted, setSubmitted] = useState(false);
    
    const submit = (e) => {
        e.preventDefault();
        
        //For future use when email is required
        let data = {
            email: email,
            role: role,
        }

        generateNewUserLink(data).then(res => {
            alert(res.message);
            setSubmitted(true);
        })
        .catch(err => {
            if(err.response.data) {
                if(err.response.data.data?.length > 0) {
                    err.response.data.data.forEach((item) => {
                        alert(item.msg)
                    })
                }
                else {
                    alert(err.response.data.message)
                }
            }
            else {
                alert("There was an error generating the email registration link.")
            }
            
        })
    }

    const handleCopy = () => {

        var copyText = document.getElementById("codeText");

        copyText.disabled = false;
        /* Select the text field */
        copyText.focus();
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        copyText.disabled = true;

        console.log('copied');
    }

    return (
        <div>
            
            <div className={styles.backLink} onClick={() => setPage(null)}>
            <span><FaArrowLeft style={{width: 15, height: 15, marginBottom: 3, fontWeight: 600}} /> Back to Users</span>
        </div>
            
            <h4>Create New User</h4>
            <hr></hr>
            {submitted === false ?
                (
                    <Form onSubmit={(e) => submit(e)}>
                    
                        <p>Select a role for the user you want to create, and the email for the registration link to be sent to.</p>

                        <Col xs = {12}>
                            <Form.Label>E-mail</Form.Label>
                            <Form.Group>
                                <Form.Control name='E-mail' type="email" placeholder="E-mail" required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}/>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label>Role</Form.Label>
                                <Form.Control as={"select"} name='role' type="text" placeholder="Role" required
                                value={role}
                                onChange={(event) => setRole(event.target.value)}>
                                    <option>ADMIN</option>
                                    <option>TUTOR</option>
                                    <option>USER</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        {/* <Row className='justify-content-end'> */}
                            <Col xs={6} sm={6}>
                                <Button type='submit' className={styles.bcpButton}>Generate Link</Button>    
                            </Col>
                        {/* </Row> */}
                    </Form>
                )
                :
                (
                    <p>
                        A registration link was sent to the provided email.
                    </p>
                    // <div className="d-flex">
                    //     <input style={{width: '85%', marginRight: '5px'}} id='codeText' value={link} disabled/> 
                    //     <div className='d-flex justify-content-center'>
                    //         <Button onClick={() => handleCopy()} className={styles.copyBtn}><FaClipboard style={{fontStyle: 'normal'}}/></Button>
                    //     </div>
                    // </div>
                )
            }
        </div>
    )
}