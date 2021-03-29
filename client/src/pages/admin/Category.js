import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Jumbotron, Modal } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

const ModalAdd = ({ showAdd, addProduct, handleCloseAdd }) => {
    const defaultData = { nama_kategori: '' }
    const [data, setData] = useState(defaultData)

    const onClickAdd = () => {
        console.log(data)
        addProduct(data);
        setData(defaultData);
    }

    const onChangeData = (e) => {
        const key = e.target.attributes.name.value;
        let value = e.target.value;

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
                        <Form.Control name="nama_kategori" type="text" defaultValue={data.nama_kategori} onChange={onChangeData} />
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
                        <Form.Control name="nama_kategori" type="text" defaultValue={product.nama_kategori} onChange={onChangeData} />
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
    const [category, setCategory] = useState({});
    const [showDelete, setShowDelete] = useState(0); //show delete modal
    const [showEdit, setShowEdit] = useState(0);
    const [showAdd, setShowAdd] = useState(false)

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

    const handleCloseDelete = () => setShowDelete(0);
    const handleShowDelete = (category) => {
        console.log(category)
        setShowDelete(category.id_kategori)
        setCategory(category)
    };

    const handleCloseEdit = () => setShowEdit(0);
    const handleShowEdit = (category) => {
        console.log(category, 'set product')
        setShowEdit(category.id_kategori)
        setCategory(category)
    }

    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const deleteCategory = async (id) => {
        const filter = (prevData) => prevData.filter(productPrev => productPrev.id_kategori !== id)
        setCategories(filter);
        setShowDelete(0)
        // axios
        try {
            await axios.delete('http://localhost:1000/admin/categories/' + id);
        } catch (err) {
            console.log(err.response)
        }
    }

    const editCategory = async () => {
        setShowEdit(0)
        const result = categories.map(oldProduct => oldProduct.id_kategori === category.id_kategori ? category : oldProduct);
        setCategories(result)
        //axios
        try {
            const res = await axios.put(`http://localhost:1000/admin/categories/${category.id_kategori}`, category);

            console.log(res, 'success')
        } catch (err) {
            console.log(err.response)
        }
    }

    const addCategory = async (newData) => {
        setCategories((prevData) => ([...prevData, newData]))
        setShowAdd(false)
        try {
            const result = await axios.post('http://localhost:1000/admin/categories', newData);

            console.log(result, 'success');
        } catch (err) {
            console.log(err.response)
        }
    }

    return (
        <Jumbotron fluid className="m-3">
            <Container>

                <h2 className="text-center mb-2">Category</h2>

                <Button onClick={handleShowAdd} className="mb-2">Add Category</Button>

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
                                    onClick={() => handleShowDelete(row)}
                                >Delete</Button>
                                <Button variant="outline-info"
                                    onClick={() => handleShowEdit(row)}
                                >Edit</Button>
                            </>
                        ),
                    }]}
                    pagination={paginationFactory()}
                />
                <ModalAdd
                    showAdd={showAdd}
                    handleCloseAdd={handleCloseAdd}
                    addProduct={addCategory}
                />
                <ModalDelete
                    show={showDelete === category.id_kategori ? true : false}
                    handleClose={handleCloseDelete}
                    id_product={category.id_kategori}
                    deleteProduct={deleteCategory}
                />
                <ModalEdit
                    showEdit={showEdit === category.id_kategori ? true : false}
                    handleCloseEdit={handleCloseEdit}
                    product={category}
                    setProduct={setCategory}
                    editProduct={editCategory}
                />
            </Container>

        </Jumbotron>
    )
}

export default Category
