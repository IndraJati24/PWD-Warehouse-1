import React, { useState } from 'react'
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios"


const History = () => {
    const [show, setShow] = useState(false);
    const [Image, setImage] = useState(null)

    const renderModal = () => {
        return (
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Buktibayar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.File id="formcheck-api-regular">
                        <Form.File.Label>Upload Bukti Bayar</Form.File.Label>
                        <Form.File.Input onChange={(e) => setImage(e.target.files[0])} />
                    </Form.File>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
             </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
             </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const handleUpload = async () => {
        try {
            const option = {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
            const data = new FormData()
            data.append('IMG', Image)
            const res=await axios.post("http://localhost:1000/order/bukti_bayar/{no_order}",data,option)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Button variant="primary" onClick={() => setShow(true)}>
                Launch demo modal
            </Button>
            {renderModal()}

        </div>
    )
}


export default History