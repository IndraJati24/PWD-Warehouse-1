import axios from 'axios'
import React, { useState } from 'react'
import { Button, Container, Form, Jumbotron } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

function ResetPassword() {
    const location = useLocation()
    const token = location.search.substring(1);
    const [newPassword, setNewPassword] = useState('')

    const onChangePassword = (e) => setNewPassword(e.target.value)

    const onSubmitForm = (e) => {
        e.preventDefault()

        axios.post('http://localhost:1000/user/resetPassword', { token }).then(res => {
            console.log('success new pass');
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <Jumbotron style={styles.jumbotron}>
            <Container>
                <Form style={styles.form} onSubmit={onSubmitForm}>
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control name="newPassword" defaultValue={newPassword} onChange={onChangePassword} placeholder="Enter your new password..." />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </Container>
        </Jumbotron>
    )
}

const styles = {
    jumbotron: { marginTop: 100, marginLeft: 50, marginRight: 50 },
    form: {
        width: "100%",
        maxWidth: 330,
        padding: 15,
        margin: "auto",
    },
}
export default ResetPassword
