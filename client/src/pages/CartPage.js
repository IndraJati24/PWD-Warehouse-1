import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Table, Form, Modal } from "react-bootstrap";
import Axios from "axios";

class CartPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			selectedIndex: null,
			newQty: 0,
			disablePlus: false,
			modal: false,
			total_stock: 0,
		};
	}

	componentDidMount() {
		Axios.get(`http://localhost:1000/cart/getCart/${this.props.id}`)
			.then((res) => {
				this.setState({ data: res.data });
				console.log(res.data);
			})

			.catch((err) => console.log(err));
	}

	handleMinus = () => {
		if (this.state.newQty <= 1) return;

		this.setState({ newQty: +this.state.newQty - 1 });
	};
	handlePlus = (total_stock) => {
		if (this.state.newQty >= parseInt(total_stock)) return;

		this.setState({ newQty: Number(this.state.newQty) + 1 });
	};

	handleDelete = (index) => {
		let tempCart = [...this.state.data];
		let id_order = tempCart[index].id_order_details;

		tempCart.splice(index, 1);

		Axios.delete(`http://localhost:1000/cart/delCart/${id_order}`)
			.then((res) => {
				this.setState({ data: tempCart });
			})
			.catch((err) => console.log(err));
	};

	changeQty = (e) => {
		this.setState({ newQty: e.target.value });
	};

	handleDone = (index, total_stock) => {
		if (parseInt(this.state.newQty) > total_stock)
			return this.setState({ modal: true, total_stock: total_stock });

		let tempProduct = this.state.data[index];
		// console.log(this.state.data[index]);
		tempProduct.quantity = parseInt(this.state.newQty);
		tempProduct.total = this.state.newQty * tempProduct.price;
		// console.log(this.state.data[index].id_product)

		let tempCart = this.state.data;

		tempCart.splice(index, 1, tempProduct);
		// console.log(tempCart)

		let cartEdit = {
			quantity: parseInt(this.state.newQty),
			total: parseInt(this.state.newQty) * this.state.data[index].price,
			no_order: this.state.data[index].no_order,
		};
		// mengirim perubahan ke database json
		Axios.post(
			`http://localhost:1000/cart/editCart/${this.state.data[index].id_product}`,
			cartEdit
		)
			.then((res) => {
				this.setState({ selectedIndex: null });
			})
			.catch((err) => console.log(err));
	};

	tableBody = () => {
		return this.state.data.map((item, index) => {
			if (this.state.selectedIndex === index) {
				// console.log(this.state.newQty);
				return (
					<tr key={index}>
						<td>{index + 1}</td>
						<td>{item.name}</td>
						<td style={{ width: 150 }}>
							<img src={item.image} height="100px" alt="" />
						</td>
						<td>{item.price.toLocaleString()}</td>
						<td style={{}}>
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Button onClick={this.handleMinus}>
									<i className="fas fa-minus"></i>
								</Button>
								<Form.Control
									style={{ width: "100px" }}
									onChange={(e) => this.changeQty(e)}
									value={this.state.newQty}
								/>
								<Button onClick={() => this.handlePlus(item.total_stock)}>
									<i className="fas fa-plus"></i>
								</Button>
							</div>
						</td>
						<td>{Number(item.price * this.state.newQty).toLocaleString()}</td>
						<td style={{ width: 170 }}>
							<div style={{ display: "flex", justifyContent: "space-around" }}>
								<Button
									variant="success"
									onClick={() => this.handleDone(index, item.total_stock)}
								>
									Done
								</Button>
								<Button
									variant="warning"
									onClick={() => this.setState({ selectedIndex: null })}
								>
									Cancel
								</Button>
							</div>
						</td>
					</tr>
				);
			}
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{item.name}</td>
					<td style={{ width: 150 }}>
						<img src={item.image} height="100px" alt="" />
					</td>
					<td>{item.price.toLocaleString()}</td>
					<td style={{ width: 100 }}>{item.quantity}</td>
					<td>{item.total.toLocaleString()}</td>
					<td style={{ width: 170 }}>
						<div style={{ display: "flex", justifyContent: "space-around" }}>
							<Button
								variant="warning"
								onClick={() =>
									this.setState({ selectedIndex: index, newQty: item.quantity })
								}
							>
								<i className="fas fa-edit"></i>
							</Button>
							<Button variant="danger" onClick={() => this.handleDelete(index)}>
								<i className="fas fa-trash"></i>
							</Button>
						</div>
					</td>
				</tr>
			);
		});
	};

	totalPrice = () => {
		let counter = 0;
		this.state.data.map((item) => (counter += item.total));
		return counter;
	};

	render() {
		console.log(this.props.id, "render");
		return (
			<div style={{ padding: "10px 30px" }}>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<h2>Hello {this.props.username} this is your cart</h2>
					<Button variant="success">Checkout</Button>
				</div>
				<div style={{ marginTop: 20 }}>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>#</th>
								<th>Name Product</th>
								<th>Image</th>
								<th>Price</th>
								<th>Quantity</th>
								<th>Total Price</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.tableBody()}
							<tr>
								<td colSpan="5" style={styles.total}>
									Grand Total
								</td>
								<td style={styles.total}>
									{this.totalPrice().toLocaleString()}
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
				<Modal
					show={this.state.modal}
					onHide={() => this.setState({ modal: false, total_stock: 0 })}
				>
					<Modal.Header closeButton>
						<Modal.Title>Notification</Modal.Title>
					</Modal.Header>
					<Modal.Body>Stock Available {this.state.total_stock}</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => this.setState({ modal: false, total_stock: 0 })}
						>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

const styles = {
	total: {
		backgroundColor: "blue",
		fontSize: 20,
		color: "white",
	},
};

const mapStateToProps = (state) => {
	return {
		id: state.user.user.id_user,
		username: state.user.user.username,
	};
};
export default connect(mapStateToProps)(CartPage);
