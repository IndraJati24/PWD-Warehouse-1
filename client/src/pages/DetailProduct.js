import React, { Component } from 'react'
import {
    Image,
    Button,
    Modal
} from 'react-bootstrap'
import Axios from 'axios'


class DetailProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {},
            modal:false
        };
    }
    componentDidMount() {
        Axios.get(`http://localhost:1000/product/getDetailPage/${this.props.match.params.id}`)
            .then((res) => {
                this.setState({ product: res.data })
            })
            .catch((err) => console.log(err))
    }

    render() {
        const { product,modal } = this.state
        return (
            <div style={{ margin: "3rem 5rem" }}>
                <h1>Product Detail</h1>
                <div style={{ display: 'flex', height: '65vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexBasis: '40%', borderRadius: '15px', borderColor: "#d4e2d4" }}>
                        <Image src={product.image ? product.image : null} style={{ height: '90%', width: '90%' }} />
                    </div>
                    <div >
                        <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", height: "20rem" }}>
                            <div>
                                <h2>{product.name ? product.name : null}</h2>
                                <h6>{product.description ? product.description : null}</h6>
                                <h5>Price: IDR {product.price ? product.price.toLocaleString() : 0}</h5>
                                <h5>Stock : {product.total_stock ? product.total_stock : null}</h5>

                            </div>
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button onClick={() => this.setState({ modal: true })} style={{ marginRight: "3rem", width: "10rem" }} >Buy</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={modal} 
                    onHide={() => this.setState({ modal: false })}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Modal heading
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Centered Modal</h4>
                        <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                            consectetur ac, vestibulum at eros.
                         </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.setState({ modal: false })}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>

        )
    }
}




export default (DetailProduct)
