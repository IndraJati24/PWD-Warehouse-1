import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Container, Image, Jumbotron, Modal } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

const ModalConfirm = ({ show, handleClose, confirmation, order }) => {
    const onClickConfirm = () => {
        confirmation('order confirm')
        handleClose()
    }

    const onClickCancel = () => {
        confirmation('canceled')
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <Image src={'http://localhost:1000' + order.no_order || 'https://templates.invoicehome.com/invoice-template-us-neat-750px.png'} width="100" height="200" alt="invoice.img" />

                <p>
                    Confirmation for order no. {order.no_order}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClickConfirm}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={onClickCancel}>
                    Reject
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function Order() {
    const [orders, setOrders] = useState([])
    const [order, setOrder] = useState({})
    const [show, setShow] = useState('');

    const handleClose = () => setShow('')
    const handleOpen = (selectedOrder) => {
        setShow(selectedOrder.no_order)
        setOrder(selectedOrder)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:1000/admin/orders')
                setOrders(result.data);
            } catch (err) {
                console.log(err.response)
            }
        }

        fetchData()
    }, [])

    const confirmation = async (message) => {
        const result = orders.map(data => data.no_order === order.no_order ? { ...data, status_name: message } : data)

        setOrders(result)
        // axios
        try {
            const isConfirm = message === 'canceled' ? false : true;
            const res = await axios.post(`http://localhost:1000/admin/orders/confirmation/${order.no_order}`, { isConfirm })
            setOrder({})
            console.log(res)

        } catch (err) {
            console.log(err.response)
        }
    }

    return (
        <Jumbotron>
            <Container>
                <h2 className="text-center">Order</h2>
                <BootstrapTable
                    keyField="no_order"
                    data={orders}
                    pagination={paginationFactory()}
                    columns={[
                        {
                            dataField: 'no_order',
                            text: 'Order Number',
                            sort: true
                        },
                        {
                            dataField: 'username',
                            text: 'User',
                            sort: true
                        },
                        {
                            dataField: 'city',
                            text: 'Location',
                            sort: true
                        },
                        {
                            dataField: 'status_name',
                            text: 'Status',
                            sort: true
                        },
                        {
                            text: 'Action',
                            isDummyField: true,
                            formatter: (cell, row, rowIndex, extraData) => {
                                const status = row.status_name

                                return (
                                    <Button onClick={() => handleOpen(row)} disabled={status.includes('pending') ? false : true} >Confirm</Button>
                                )
                            }
                        }
                    ]}
                />
                <ModalConfirm
                    show={show === order.no_order ? true : false}
                    handleClose={handleClose}
                    confirmation={confirmation}
                    order={order}
                />
            </Container>
        </Jumbotron>
    )
}

export default Order
