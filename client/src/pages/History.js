import React, { useState } from "react";
import {Button, Modal, Form, Tab, Nav, Col, Row, Accordion, Card, Table, Image} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import images from "../assets/images/no-image.png"

const URL_IMG = 'http://localhost:1000/'
const History = () => {
	const [show, setShow] = useState(false);
	const [Image, setImage] = useState(null);
	const [data, setData] = useState([]);
	const [detail, setDetail] = useState([]);
	const [history, setHistory] = useState([]);
	const [detailHistory, setDetailHistory] = useState([]);
	const [status, setStatus] = useState("");
	const [orderIdHistory, setOrderIdHistory] = useState(null);
    const [index, setIndex] = useState(null)
	const [modalCancel, setModalCancel] = useState(false)
	const [modalCancelOrder, setModalCancelOrder] = useState(false)
	const [picture, setPicture] = useState("")

	const { id } = useSelector((state) => {
		return {id: state.user.user.id_user}
	});

	const refreshPage = ()=>{
		window.location.reload();  }

		React.useEffect(() => {
			const getHistory = async () => {
				const option = {
					headers: { token: localStorage.getItem("token") },
				};
				let res = await axios.get(`http://localhost:1000/order/getOrderDetail`, option);
				let res2 = await axios.get(`http://localhost:1000/order/getAllOrder`, option);
				setDetail(res.data);
				setHistory(res2.data);
			};
			getHistory();
		}, []);
	
		React.useEffect(() => {
			let result = []
			history.forEach((item) => {
				if(item.status_name === status){
					result.push(item)
				}
			});
			setData(result);
		}, [status]);

	React.useEffect(() => {
		let result = detail.filter((item) => item.no_order === orderIdHistory);
		setDetailHistory(result);
	}, [orderIdHistory]);

	const tablePayment = () => {
		return detailHistory.map((item, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{item.name}</td>
					<td style={{ width: 150 }}>
						<img src={item.image} height="100px" />
					</td>
					<td style={{ width: 100 }}>{item.price.toLocaleString()}</td>
					<td style={{ width: 100 }}>{item.quantity}</td>
					<td>{item.total.toLocaleString()}</td>
				</tr>
			);
		});
	};

	const tableHistory = () => {
		return detailHistory.map((item, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{item.name}</td>
					<td style={{ width: 150 }}>
						<img src={item.image} height="100px" />
					</td>
					<td style={{ width: 100 }}>{item.price.toLocaleString()}</td>
					<td style={{ width: 100 }}>{item.quantity}</td>
					<td>{item.total.toLocaleString()}</td>
				</tr>
			);
		});
	};

	const totalPrice = () => {
		let counter = 0;
		detailHistory.map((item) => (counter += item.total));
		return counter;
	};

    
    const handleOpenModal = (idx) => {
        let idOrder = data[idx].no_order
		let picture = data[idx].bukti_bayar
        setShow(true)
        setOrderIdHistory(idOrder)
        setIndex(idx)
		setPicture(picture)
    }
	const renderModalCancel = () => {
		return(
			<Modal show={modalCancel} onHide={()=> setModalCancel(false)}>
        		<Modal.Header closeButton>
          		<Modal.Title>Warning</Modal.Title>
        		</Modal.Header>
        	<Modal.Body>Are You Sure cancel this order?</Modal.Body>
        	<Modal.Footer>
          		<Button variant="secondary" onClick={()=> setModalCancel(false)}>
            	Close
          		</Button>
          	<Button variant="primary" onClick={handleCancelConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
		)
	}

	const handleCancel=(idx)=>{
		let idOrder = data[idx].no_order
        setModalCancel(true)
        setOrderIdHistory(idOrder)
        setIndex(idx)
	}

	const handleCancelConfirm=()=>{
		let orderId = orderIdHistory
		
		const idxData = index
        const temp = [...data]
        temp.splice(idxData, 1)
 
		axios.post(`http://localhost:1000/order/cancelPaymentPending/${orderId}`)
		.then((res)=>{
			setData(temp)
			setModalCancel(false)
			{refreshPage()}
		})
		.catch((err)=> console.log(err))
	}

	const renderModal = () => {
		return (
			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Upload Buktibayar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<img src={picture ? URL_IMG + picture : images} alt="No-Image" height="100px"/>
					<Form.File id="formcheck-api-regular">
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
		);
	};

	const handleUpload = async () => {
	   const order = parseInt(orderIdHistory);
		try {
			const option = {
				headers: { "Content-Type": "multipart/form-data" },
			};
			const data = new FormData();
			data.append("IMG", Image);
			const res = await axios.post(
				`http://localhost:1000/order/bukti_bayar/${order}`,
				data,
				option
			);
			
			setShow(false);
			alert("Upload Success");
			{refreshPage()}
		} catch (error) {
            alert("Tolong Masukkan Bukti Bayar dan Hanya Boleh Gambar")
		}
	};

	const handleOpenModalOrder = (idx) => {
		let idOrder = data[idx].no_order
        setModalCancelOrder(true)
        setOrderIdHistory(idOrder)
        setIndex(idx)
	}

	const renderModalCancelOrder = () => {
		return(
			<Modal show={modalCancelOrder} onHide={()=> setModalCancelOrder(false)}>
        		<Modal.Header closeButton>
          		<Modal.Title>Warning</Modal.Title>
        		</Modal.Header>
        	<Modal.Body>Are You Sure cancel this order?</Modal.Body>
        	<Modal.Footer>
          		<Button variant="secondary" onClick={()=> setModalCancelOrder(false)}>
            	Close
          		</Button>
          	<Button variant="primary" onClick={handleCancelConfirmOrder}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
		)
	}

	const handleCancelConfirmOrder=()=>{
		let orderId = orderIdHistory
	
		const idxData = index
        const temp = [...data]
        temp.splice(idxData, 1)
 
		axios.post(`http://localhost:1000/order/cancelOrderConfirm/${orderId}`)
		.then((res)=>{
			setData(temp)
			setModalCancelOrder(false)
			{refreshPage()}
		})
		.catch((err)=> console.log(err))
	}

	const handleArrived =(idx)=>{
		let idOrder = data[idx].no_order
		const temp = [...data]
        temp.splice(idx, 1)
       
		axios.post(`http://localhost:1000/order/arrived/${idOrder}`)
		.then((res)=>{
			setData(temp)
		})
		.catch((err)=> console.log(err))
	}

	return (
	<div style={{ padding: 30 }}>
		<Tab.Container id="left-tabs-example" defaultActiveKey="5">
			<Row>
				<Col sm={3}>
					<Nav variant="pills" className="flex-column">
						<Nav.Item>
							<Nav.Link eventKey="5">All History</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link onClick={() => setStatus("payment pending")} eventKey="1">
								Payment Pending
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link onClick={() => setStatus("order confirm")} eventKey="2">
								Order Confirm
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link onClick={() => setStatus("delivered")} eventKey="3">
								Delivered
							</Nav.Link>
						</Nav.Item>
					</Nav>
				</Col>
				<Col sm={9}>
				<Tab.Content>
					<Tab.Pane eventKey="1">
						{data.length !== 0 ? (
							data.map((item, index) => {
								return (
									<Card key={index}>
										<Card.Header style={{display: "flex",justifyContent: "space-between",}}>
											<Accordion.Toggle as={Button} variant="link" onClick={() => setOrderIdHistory(orderIdHistory === item.no_order ? null : item.no_order)}>
											Invoice : {item.no_order}
											</Accordion.Toggle>
											<div>
											<Button variant="danger" onClick={()=> handleCancel(index)}>Cancel</Button>
											{renderModalCancel()}
											<Button variant="primary" onClick={()=>handleOpenModal(index)}>
												Upload your payment here
											</Button>
											{renderModal()}
											
											</div>
										</Card.Header>
										{orderIdHistory === item.no_order  && (
											<Table striped hover>
												<thead>
													<tr>
														<th>#</th>
														<th>Product</th>
														<th>Images</th>
														<th>Price</th>
														<th>Quantity</th>
														<th>Total Price</th>
													</tr>
												</thead>
												<tbody>
													{tablePayment()}
													<tr>
														<td colSpan="5">Grand Total</td>
														<td>{totalPrice().toLocaleString()}</td>
													</tr>
												</tbody>
											</Table>
										)}	
									</Card>);})
							) : (<h1>No History</h1>)}
					</Tab.Pane>
					<Tab.Pane eventKey="2">
						{data.length !== 0 ? (
							data.map((item, index) => {
								return (
									<Card key={index}>
										<Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
										<Accordion.Toggle as={Button} variant="link" onClick={() => setOrderIdHistory(orderIdHistory === item.no_order ? null : item.no_order)}>
										Invoice : {item.no_order}
										</Accordion.Toggle>
										<Button onClick={()=> handleOpenModalOrder(index)} variant="danger">Cancel</Button>
										{renderModalCancelOrder()}
										</Card.Header>
										{orderIdHistory === item.no_order  && (
											<Table striped hover>
												<thead>
													<tr>
														<th>#</th>
														<th>Product</th>
														<th>Images</th>
														<th>Price</th>
														<th>Quantity</th>
														<th>Total Price</th>
													</tr>
												</thead>
												<tbody>
													{tablePayment()}
													<tr>
														<td colSpan="5">Grand Total</td>
														<td>{totalPrice().toLocaleString()}</td>
													</tr>
												</tbody>
											</Table>)}
									</Card>)})
							) : (<h1>No History</h1>)}
					</Tab.Pane>
					<Tab.Pane eventKey="3">
						{data.length !== 0 ? (
							data.map((item, index) => {
								return (
									<Card key={index}>
										<Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
										<Accordion.Toggle as={Button} variant="link" onClick={() => setOrderIdHistory(orderIdHistory === item.no_order ? null : item.no_order)}>
										Invoice : {item.no_order}
										</Accordion.Toggle>
											<Button onClick={()=> handleArrived(index)}variant="success">Arrived</Button>
										</Card.Header>
											{orderIdHistory === item.no_order  && (
												<Table striped hover>
													<thead>
														<tr>
															<th>#</th>
															<th>Product</th>
															<th>Images</th>
															<th>Price</th>
															<th>Quantity</th>
															<th>Total Price</th>
														</tr>
													</thead>
													<tbody>
														{tablePayment()}
														<tr>
															<td colSpan="5">Grand Total</td>
															<td>{totalPrice().toLocaleString()}</td>
														</tr>
													</tbody>
												</Table>)}</Card>)})
							) : (<h1>No History</h1>)}		
					</Tab.Pane>
					<Tab.Pane eventKey="5">
						{history.length !== 0 ? (
							history.map((item, index) => {
								return (
									<Card key={index}>
										<Accordion.Toggle as={Card.Header} onClick={() => setOrderIdHistory(orderIdHistory === item.no_order ? null : item.no_order)}>	
											Invoice : {item.no_order}, date : {item.date}, status : {item.status_name}
										</Accordion.Toggle>
											{orderIdHistory === item.no_order  && (
												<Table striped hover>
													<thead>
														<tr>
															<th>#</th>
															<th>Product</th>
															<th>Images</th>
															<th>Price</th>
															<th>Quantity</th>
															<th>Total Price</th>
														</tr>
													</thead>
													<tbody>
														{tableHistory()}
														<tr>
															<td colSpan="5">Grand Total</td>
															<td>{totalPrice().toLocaleString()}</td>
														</tr>
													</tbody>
												</Table>)}
									</Card>)})
						) : (<h1>No History</h1>)}
					</Tab.Pane>
				</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>
	</div>
	);
};

export default History;
