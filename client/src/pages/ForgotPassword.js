import axios from 'axios'
import React, { useState } from 'react'
import { Button, Container, Form, Jumbotron } from 'react-bootstrap'

function ForgotPassword() {
    const [email, setEmail] = useState('')

    const onChangeEmail = (e) => setEmail(e.target.value);

    const onSubmitForm = (e) => {
        e.preventDefault()

        axios.post('http://localhost:1000/user/forgotPassword', { email }).then(res => {
            console.log('success');
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <Jumbotron style={styles.jumbotron}>
            <Container>
                <Form style={styles.form} onSubmit={onSubmitForm}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" defaultValue={email} onChange={onChangeEmail} placeholder="Enter your email..." />
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

export default ForgotPassword
