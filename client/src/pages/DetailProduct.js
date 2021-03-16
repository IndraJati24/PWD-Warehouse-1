import React, { Component } from "react";
import { Image, Button, Modal, Form } from "react-bootstrap";
import Axios from "axios";

class DetailProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			modal: false,
			qty: 1,
		};
	}
	componentDidMount() {
		Axios.get(
			`http://localhost:1000/product/getDetailPage/${this.props.match.params.id}`
		)
			.then((res) => {
				this.setState({ product: res.data });
			})
			.catch((err) => console.log(err));
	}

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
		const { qty, product } = this.state;

		if (qty > parseInt(product.total_stock))
			return alert(
				`The amount exceeds from stock, current stock is ${product.total_stock} `
			);
		this.setState({ modal: false });
	};

	render() {
		const { product, modal, qty } = this.state;
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
			</div>
		);
	}
}

export default DetailProduct;
