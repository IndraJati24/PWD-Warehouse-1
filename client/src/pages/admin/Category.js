import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Jumbotron, Modal } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

const ModalAdd = ({ showAdd, addProduct, handleCloseAdd }) => {
    const defaultData = {
        name: '',
        price: 0,
        description: '',
        image: '',

    }
    const [data, setData] = useState(defaultData)

    const onClickAdd = () => {
        // console.log(data)
        addProduct(data);
        setData(defaultData);
    }

    const onChangeData = (e) => {
        const key = e.target.attributes.name.value;
        let value = e.target.value;

        if (parseInt(value)) value = parseInt(value)

        setData(prevData => ({ ...prevData, [key]: value }))
    }

    return (
        <Modal show={showAdd} onHide={handleCloseAdd}>
            <Modal.Header closeButton>
                <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name" type="text" defaultValue={data.name} name="name" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control name="price" type="number" defaultValue={data.price} name="price" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" type="text" as="textarea" defaultValue={data.description} rows={3} name="description" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClickAdd}>
                    Add
                </Button>
                <Button variant="primary" onClick={handleCloseAdd}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const ModalDelete = ({ show, handleClose, id_product, deleteProduct }) => {
    const onClickDelete = () => {
        deleteProduct(id_product)
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure want to delete {id_product}?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClickDelete}>
                    Delete
          </Button>
                <Button variant="primary" onClick={handleClose}>
                    Cancel
          </Button>
            </Modal.Footer>
        </Modal>
    )
}

const ModalEdit = ({ showEdit, handleCloseEdit, product, editProduct, setProduct }) => {
    const onClickEdit = () => {
        editProduct()
        handleCloseEdit()
    }

    const onChangeData = (e) => {
        const key = e.target.attributes.name.value;
        let value = e.target.value;

        if (!!parseInt(value)) value = parseInt(value)

        setProduct(prevData => ({ ...prevData, [key]: value }))
    }

    return (
        <Modal show={showEdit} onHide={handleCloseEdit}>
            <Modal.Header closeButton>
                <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" defaultValue={product?.name} name="name" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" defaultValue={product?.price} name="price" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" defaultValue={product?.description} rows={3} name="description" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClickEdit}>
                    Edit
                </Button>
                <Button variant="primary" onClick={handleCloseEdit}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function Category() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:1000/admin/categories')
                console.log(res.data)
                setCategories(res.data);
            } catch (err) {
                console.log(err.response)
            }
        }

        fetchData()
    }, [])
    return (
        <Jumbotron fluid className="m-3">
            <Container>

                <h2 className="text-center mb-2">Category</h2>

                <Button className="mb-2">Add Category</Button>

                <BootstrapTable
                    keyField="id_kategori"
                    data={categories}
                    columns={[{
                        dataField: 'id_kategori',
                        text: 'ID',
                        sort: true
                    }, {
                        dataField: 'nama_kategori',
                        text: 'Category',
                        sort: true
                    }, {
                        dataField: 'action',
                        text: 'action',
                        isDummyField: true,
                        formatter: (cell, row, rowIndex, extraData) => (
                            <>
                                <Button variant="outline-danger"
                                // onClick={() => handleShow(row)}
                                >Delete</Button>
                                <Button variant="outline-info"
                                // onClick={() => handleShowEdit(row)}
                                >Edit</Button>
                            </>
                        ),
                    }]}
                    pagination={paginationFactory()}
                />
                <ModalAdd
                // showAdd={showAdd} 
                // handleCloseAdd={handleCloseAdd} 
                // addProduct={addProduct} 
                />
                <ModalDelete
                // show={show === product.id_product ? true : false}
                // handleClose={handleClose}
                // id_product={product.id_product}
                // deleteProduct={deleteProduct}
                />
                <ModalEdit
                // showEdit={showEdit === product.id_product ? true : false}
                // handleCloseEdit={handleCloseEdit}
                // product={product}
                // setProduct={setProduct}
                // editProduct={editProduct}
                />
            </Container>

        </Jumbotron>
    )
}

export default Category
