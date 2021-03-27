import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom"
import { Button, Table, Form, Modal, Image, Toast } from "react-bootstrap";
import Axios from "axios";

import OpencageAutocomplete from "../assets/OpencageAutocomplete";
import logoBCA from "../assets/images/logo-bca.jpg";
import logoMandiri from "../assets/images/logo-mandiri.jpg";
class CartPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			selectedIndex: null,
			newQty: 0,
			disablePlus: false,
			modal: false,
			modalCheckOut: false,
			total_stock: 0,
			invalidNama: false,
			invalidTelepon: false,
			invalidAlamat: false,
			pembayaran: null,
			getLocationUser: null,
			toast: [false, ""],
			city: null,
			history: false,
			modalDelete: false
		};
	}

	componentDidUpdate = async () => {
		if (this.state.idx != this.props.id) {
			await this.setState({ idx: this.props.id });
			Axios.get(`http://localhost:1000/cart/getCart/${this.state.idx}`)
				.then((res) => {
					this.setState({ data: res.data });
					// console.log(res.data);
				})
				.catch((err) => console.log(err));
		}
	};

	componentDidMount() {
		Axios.get(`http://localhost:1000/cart/getCart/${this.props.id}`)
			.then((res) => {
				this.setState({ data: res.data });
				// console.log(res.data)
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
		let no_id = {
			no_order: tempCart[index].no_order,
			id_order: tempCart[index].id_order_details
		}

		Axios.post(`http://localhost:1000/cart/delCart`, no_id)
			.then((res) => {
				tempCart.splice(index, 1);
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
							<img src={item.image} height="100px" />
						</td>
						<td>{item.price.toLocaleString()}</td>
						<td style={{}}>
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Button onClick={this.handleMinus}>
									<i className="fas fa-minus"></i>
								</Button>
								<Form.Control
									style={{
										textAlign: "center",
										width: 100,
									}}
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
						<img src={item.image} height="100px" />
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

	handleSubmit = () => {
		let { getLocationUser, pembayaran, data, city } = this.state;

		let nama = this.refs.nama.value;
		let telepon = this.refs.telepon.value;
		let alamat = this.refs.alamat.value;

		if (!nama) return this.setState({ invalidNama: true });
		if (!telepon) return this.setState({ invalidTelepon: true });
		if (!alamat) return this.setState({ invalidAlamat: true });
		if (!getLocationUser)
			return this.setState({ toast: [true, "Tolong isi Form Kota Provinsi"] });
		if (!pembayaran)
			return this.setState({ toast: [true, "Tolong Pilih Pembayarannya"] });
		// console.log(nama,telepon,alamat,getLocationUser,pembayaran, city);

		let updateAlamat = {
			id_user: this.props.id,
			address: alamat,
			city: city,
			lat: getLocationUser.lat,
			lng: getLocationUser.lng,
		};

		// console.log(updateAlamat)

		let gudang = {
			no_order: data[0].no_order,
			lat: getLocationUser.lat,
			lng: getLocationUser.lng,
		};

		let invoice = {
			no_order: data[0].no_order,
			alamat,
			total_harga: this.totalPrice().toLocaleString(),
			email: this.props.email,
			tgl_transaksi: this.state.data[0].date,
			cart: data
		}

		Axios.post(`http://localhost:1000/order/wareLoc`, gudang)
			.then((res) => {
				Axios.post(`http://localhost:1000/user/address`, updateAlamat)
					.then((res) => {
						// Axios.post("http://localhost:1000/cart/invoice",invoice)
						// .then((res)=>{
						this.setState({
							invalidNama: false,
							invalidTelepon: false,
							invalidAlamat: false,
							toast: [true, "Transaksi Sukses, Silahkan Lanjutkan ke Pembayaran..."],
							modalCheckOut: false,
							history: true
						})
						alert("transaction success please check history menu")
						// })
						// .catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	};

	handleDeleteCart = () => {
		Axios.delete(`http://localhost:1000/cart/delAllCart/${this.props.id}`)
			.then((res) => {
				this.setState({ data: [] })
			})
			.catch((err) => console.log(err))
	}

	render() {
		let apiKey = "37603d38a85f4f36bda754c5aabfac4a";
		if (this.state.history) return <Redirect to="/" />
		return (
			<div style={{ padding: "10px 30px" }}>
				{this.state.data.length !== 0 ? (
					<>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<h2>Hello {this.props.username} this is your cart</h2>
							<div>
								<Button variant="danger" onClick={() => this.setState({ modalDelete: true })}>
									Delete All
					</Button>
								<Button
									variant="success"
									onClick={() => this.setState({ modalCheckOut: true })}
									disabled={this.state.data.length === 0 ? true : false}
								>
									Checkout
					</Button>
							</div>
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
					</>
				) : (<h1>Cart is Empty</h1>)}
				<Modal show={this.state.modalDelete} onHide={() => this.setState({ modalDelete: false })}>
					<Modal.Header closeButton>
						<Modal.Title>Warning</Modal.Title>
					</Modal.Header>
					<Modal.Body>Are you sure to delete this cart ?</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => this.setState({ modalDelete: false })}>
							Close
          			</Button>
						<Button variant="success" onClick={this.handleDeleteCart}>
							Yes
          			</Button>
					</Modal.Footer>
				</Modal>

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

				<Modal
					show={this.state.modalCheckOut}
					onHide={() => this.setState({
						modalCheckOut: false, invalidNama: false,
						invalidTelepon: false,
						invalidAlamat: false,
						pembayaran: null,
						getLocationUser: null,
					})}
				>
					<Modal.Header closeButton>
						<Modal.Title>Notification</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group>
								<Form.Label>Nama Penerima</Form.Label>
								<Form.Control
									ref="nama"
									type="text"
									placeholder="Nama..."
									required
									isInvalid={this.state.invalidNama}
								/>
								<Form.Control.Feedback type="invalid">
									Tolong Masukan Nama Penerima
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group>
								<Form.Label>No Telepon</Form.Label>
								<Form.Control
									ref="telepon"
									type="number"
									placeholder="No Telepon..."
									required
									isInvalid={this.state.invalidTelepon}
								/>
								<Form.Control.Feedback type="invalid">
									Tolong Masukan Nomer Penerima
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group>
								<Form.Label>Alamat Lengkap</Form.Label>
								<Form.Control
									ref="alamat"
									type="text"
									placeholder="Masukan Jalan,Nomor,RT/RW,Kecamatan,Kode Pos"
									required
									isInvalid={this.state.invalidAlamat}
								/>
								<Form.Control.Feedback type="invalid">
									Tolong Masukan Alamat Penerima
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group>
								<Form.Label>Kota Provinsi</Form.Label>
								<OpencageAutocomplete
									placeholder="Kota Provinsi"
									apiKey={apiKey}
									onSuggestionSelected={(event, { suggestion }) => {
										console.log(suggestion);
										this.setState({
											getLocationUser: suggestion.geometry,
											city: suggestion.formatted,
										});
									}}
								/>
							</Form.Group>
							<Form.Label>Pembayaran</Form.Label>
							<Form.Group>
								<Form
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-around",
									}}
								>
									<div>
										<Form.Check
											name="Pembayaran"
											label="Mandiri"
											type="radio"
											value="Mandiri"
											onClick={() => this.setState({ pembayaran: "Mandiri" })}
										/>
										<Image src={logoMandiri} fluid />
										<Form.Text>2208 1996</Form.Text>
										<Form.Text>Fresh Shop</Form.Text>
									</div>
									<div>
										<Form.Check
											name="Pembayaran"
											label="BCA"
											type="radio"
											value="BCA"
											onClick={() => this.setState({ pembayaran: "BCA" })}
										/>
										<Image src={logoBCA} fluid />
										<Form.Text>2208 1996</Form.Text>
										<Form.Text>Fresh Shop</Form.Text>
									</div>
								</Form>
								{/* {console.log(this.state.pembayaran)} */}
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<div>
							<h5>IDR {this.totalPrice().toLocaleString()}</h5>
						</div>
						<div>
							<Button
								style={{ marginRight: ".5rem" }}
								variant="primary"
								onClick={this.handleSubmit}
							>
								Submit
							</Button>
							<Button
								variant="primary"
								onClick={() => this.setState({
									modalCheckOut: false, invalidNama: false,
									invalidTelepon: false,
									invalidAlamat: false,
									pembayaran: null,
									getLocationUser: null,
								})}
							>
								Close
							</Button>
						</div>
					</Modal.Footer>
				</Modal>

				<Toast
					style={{
						position: "absolute",
						top: 20,
						right: 50,
						width: "15rem",
					}}
					show={this.state.toast[0]}
					onClose={() => this.setState({ toast: [false, ""] })}
					delay={3000}
					autohide
				>
					<Toast.Header>
						<strong className="mr-auto">Notification</strong>
					</Toast.Header>
					<Toast.Body>{this.state.toast[1]}</Toast.Body>
				</Toast>
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
		email: state.user.user.email
	};
};
export default connect(mapStateToProps)(CartPage);
