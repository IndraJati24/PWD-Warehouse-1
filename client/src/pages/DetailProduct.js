import React, { Component } from "react";
import { Image, Button, Modal, Form, Toast, Card } from "react-bootstrap";
import Axios from "axios";
import { connect } from 'react-redux'

class DetailProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {},
            modal: false,
            qty: 1,
            toast: false,
            cart: [],
            kategoriSama: [],
            allProduct: []
        };
    }
    componentDidMount() {
        Axios.get(
            'http://localhost:1000/product/getAll'
        )
            .then((res) => {
                Axios.get(`http://localhost:1000/cart/getCart/${this.props.id}`)
                    .then((res2) => {
                        let detailPage = res.data.filter(item => item.id_product === parseInt(this.props.match.params.id))[0]
                        let kategoriSerupa = res.data.filter(item => item.id_kategori === parseInt(detailPage.id_kategori) && item.total_stock > 0 && item.id_product != detailPage.id_product)
                        this.setState({ cart: res2.data, product: detailPage, kategoriSama: kategoriSerupa, allProduct: res.data });
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }

    // componentDidUpdate = async () => {

    // 		Axios.get('http://localhost:1000/product/getAll')
    // 			.then((res) => {
    //                 let detailPage = res.data.filter(item => item.id_product === parseInt(this.props.match.params.id))[0]
    //                 let kategoriSerupa = res.data.filter(item => item.id_kategori === parseInt(detailPage.id_kategori) && item.total_stock>0 &&item.id_product!=detailPage.id_product)

    //                 this.setState({ product: detailPage,kategoriSama: kategoriSerupa });
    // 				// console.log(res.data);
    // 			})
    // 			.catch((err) => console.log(err));

    // };

    handleMinus = () => {
        if (this.state.qty <= 1) return;
        this.setState({ qty: this.state.qty - 1 });
    };

    handlePlus = () => {
        const { qty, product } = this.state;

        if (qty >= product.total_stock) return;
        this.setState({ qty: parseInt(this.state.qty) + 1 });
    };

    handleAddToCart = () => {
        const { qty, product, cart } = this.state;
        // console.log("sebelum",cart);
        let cartFilter = []
        let idx = null
        cart.forEach((item, index) => {
            if (item.id_product === product.id_product) {
                cartFilter.push(item)
                idx = index
            }
        })
        const date = new Date()
        if (cartFilter.length !== 0) {
            if (parseInt(qty) + cartFilter[0].quantity > parseInt(product.total_stock))
                return alert(
                    `The amount exceeds from stock, current stock is ${product.total_stock} `
                );
            cartFilter[0].quantity += qty
            cart.splice(idx, 1, cartFilter[0])
            let cartData = {
                no_order: Date.now(),
                date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                id_user: (this.props.id ? this.props.id : 2),
                id_product: product.id_product,
                quantity: qty,
                total: qty * product.price
            }

            Axios.post(`http://localhost:1000/cart/addCart`, cartData)
                .then((res) => {
                    this.setState({ modal: false, toast: true });
                })
                .catch((err) => console.log(err));
        } else {
            if (parseInt(qty) > parseInt(product.total_stock))
                return alert(
                    `The amount exceeds from stock, current stock is ${product.total_stock} `
                );

            let cartData = {
                no_order: Date.now(),
                date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                id_user: (this.props.id ? this.props.id : 2),
                id_product: product.id_product,
                quantity: qty,
                total: qty * product.price
            }

            Axios.post(`http://localhost:1000/cart/addCart`, cartData)
                .then((res) => {
                    Axios.get(`http://localhost:1000/cart/getCart/${this.props.id}`)
                        .then((res2) => {
                            this.setState({ cart: res2.data });

                            this.setState({ modal: false, toast: true });
                        })
                        .catch((err) => console.log(err));
                    // window.location.reload(false); 
                })
                .catch((err) => console.log(err));
        }



    };

    handleBuyCat = (idx) => {
        let detailPage = this.state.allProduct.filter(item => item.id_product === parseInt(idx))[0]
        let kategoriSerupa = this.state.allProduct.filter(item => item.id_kategori === parseInt(detailPage.id_kategori) && item.total_stock > 0 && item.id_product != detailPage.id_product)
        this.setState({ product: detailPage, kategoriSama: kategoriSerupa, qty: 1 });
    }

    render() {
        const { product, modal, qty, kategoriSama } = this.state;
        console.log(this.state.kategoriSama);
        return (
            <div style={{ margin: "3rem 5rem" }}>
                <h1>Product Detail</h1>
                <div style={{ display: "flex", height: "65vh" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexBasis: "40%",
                            borderRadius: "15px",
                            borderColor: "#d4e2d4",
                        }}
                    >
                        <Image
                            src={product.image ? product.image : null}
                            style={{ height: "90%", width: "90%" }}
                        />
                    </div>
                    <div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "20rem",
                            }}
                        >
                            <div>
                                <h2>{product.name ? product.name : null}</h2>
                                <h6>{product.description ? product.description : null}</h6>
                                <h5>
                                    Price: IDR{" "}
                                    {product.price ? product.price.toLocaleString() : 0}
                                </h5>
                                <h5>
                                    Stock : {product.total_stock ? product.total_stock : null}
                                </h5>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button
                                    onClick={() => this.setState({ modal: true })}
                                    style={{ marginRight: "3rem", width: "10rem" }}
                                >
                                    Buy
								</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <h2>Kategori Serupa</h2>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {kategoriSama.length === 0 ? null : kategoriSama.slice(0, 5).map((item, index) => {
                        return (
                            <Card style={{ width: '12.5rem', margin: "1rem 1rem" }} key={index}>
                                <Card.Img variant="top" src={item.image} style={{ height: "13rem" }} />
                                <Card.Body >
                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>IDR {item.price.toLocaleString()}</Card.Text>
                                        <div >
                                            <Button style={{ width: "100%", marginRight: "8px" }} variant="success" onClick={() => this.handleBuyCat(item.id_product)} >Buy</Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
                <Modal
                    show={modal}
                    onHide={() => this.setState({ modal: false, qty: 1 })}
                    size="m"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            How much do you want to buy
						</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                width: 200,
                            }}
                        >
                            <Button
                                size="sm"
                                style={{ borderRadius: 10 }}
                                variant={qty <= 1 ? "outline-secondary" : "outline-danger"}
                                disabled={qty === 1 ? true : false}
                                onClick={this.handleMinus}
                            >
                                <i class="fas fa-minus-circle"></i>
                            </Button>
                            <Form.Control
                                style={{
                                    textAlign: "center",
                                    fontSize: 25,
                                    borderColor: "transparent",
                                    fontWeight: "bold",
                                }}
                                value={qty}
                                onChange={(e) => this.setState({ qty: e.target.value })}
                            />
                            <Button
                                size="sm"
                                style={{ borderRadius: 10 }}
                                variant={
                                    qty >= product.total_stock
                                        ? "outline-secondary"
                                        : "outline-success"
                                }
                                disabled={qty == product.total_stock ? true : false}
                                onClick={this.handlePlus}
                            >
                                <i class="fas fa-plus-circle"></i>
                            </Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleAddToCart}>Add To Cart</Button>
                    </Modal.Footer>
                </Modal>



                <Toast
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 50,
                        width: "15rem"
                    }}
                    show={this.state.toast}
                    onClose={() => this.setState({ toast: false })}
                    delay={3000} autohide
                >
                    <Toast.Header>
                        <strong className="mr-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Success Add To Cart</Toast.Body>
                </Toast>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.user.user.id_user
    }
}

export default connect(mapStateToProps)(DetailProduct)
