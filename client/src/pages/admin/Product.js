import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image, Jumbotron, Modal } from 'react-bootstrap'
import axios from 'axios'

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


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
                        <Form.Control type="text" defaultValue={product.name} name="name" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" defaultValue={product.price} name="price" onChange={onChangeData} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" defaultValue={product.description} rows={3} name="description" onChange={onChangeData} />
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

function Product() {
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState({});
    const [show, setShow] = useState(0); //show delete modal
    const [showEdit, setShowEdit] = useState(0);
    const [showAdd, setShowAdd] = useState(false)

    useEffect(() => {
        axios.get('http://localhost:1000/admin/products').then(({ data }) => {
            setProducts(data)
        }).catch(err => {
            console.log(err.response)
        })
    }, [])

    const handleClose = () => setShow(0);
    const handleShow = (product) => {
        console.log(product)
        setShow(product.id_product)
        setProduct(product)
    };

    const handleCloseEdit = () => setShowEdit(0);
    const handleShowEdit = (product) => {
        console.log(product, 'set product')
        setShowEdit(product.id_product)
        setProduct(product)
    }

    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const deleteProduct = async (id) => {
        const filter = (prevData) => prevData.filter(productPrev => productPrev.id_product !== id)
        setProducts(filter);
        setShow(0)
        // axios
        try {
            await axios.delete('http://localhost:1000/admin/products/' + id);
        } catch (err) {
            console.log(err.response)
        }
    }

    const editProduct = async () => {
        setShowEdit(0)
        const result = products.map(oldProduct => oldProduct.id_product === product.id_product ? product : oldProduct);
        setProducts(result)
        //axios
        try {
            const result = await axios.put(`http://localhost:1000/admin/products/${product.id_product}`, product);

            console.log(result, 'success')
        } catch (err) {
            console.log(err.response)
        }
    }

    const addProduct = async (newData) => {
        setProducts((prevData) => ([...prevData, newData]))
        setShowAdd(false)
        try {
            const result = await axios.post('http://localhost:1000/admin/products', newData);

            console.log(result, 'success');
        } catch (err) {
            console.log(err.response)
        }
    }

    const columnsOption = [{
        dataField: 'id_product',
        text: 'ID',
        sort: true
    }, {
        dataField: 'name',
        text: 'name',
        sort: true
    }, {
        dataField: 'price',
        text: 'price',
        sort: true,
        formatter: (cell, row, rowIndex, extraData) => (
            <span>Rp. {row.price},-</span>
        )
    }, {
        dataField: 'description',
        text: 'description',
        sort: true,
    }, {
        dataField: 'image', text: 'image', isDummyField: true, formatter: (cell, row) => (
            <Image src={row.image} alt="product" height="50" width="50" />
        )
    },
    {
        dataField: 'action',
        text: 'action',
        isDummyField: true,
        formatter: (cell, row, rowIndex, extraData) => (
            <>
                <Button variant="outline-danger" onClick={() => handleShow(row)}>Delete</Button>
                <Button variant="outline-info" onClick={() => handleShowEdit(row)}>Edit</Button>
            </>
        ),
    }]

    return (
        <Jumbotron fluid className="m-3" >
            <Container>
                <h2 className="text-center mb-5">Product List</h2>
                <Button onClick={handleShowAdd} className="mb-2">Add Product</Button>

                <BootstrapTable keyField="id_product" data={products} columns={columnsOption} pagination={paginationFactory()} />
                <ModalAdd showAdd={showAdd} handleCloseAdd={handleCloseAdd} addProduct={addProduct} />
                <ModalDelete
                    show={show === product.id_product ? true : false}
                    handleClose={handleClose}
                    id_product={product.id_product}
                    deleteProduct={deleteProduct}
                />
                <ModalEdit
                    showEdit={showEdit === product.id_product ? true : false}
                    handleCloseEdit={handleCloseEdit}
                    product={product}
                    setProduct={setProduct}
                    editProduct={editProduct}
                />
            </Container>
        </Jumbotron>
    )
}

export default Product
