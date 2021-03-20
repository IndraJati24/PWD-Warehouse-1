import React, { useState } from "react";
import {
	Button,
	Modal,
	Form,
	Tab,
	Nav,
	Col,
	Row,
	Accordion,
	Card,
	Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const History = () => {
	const [show, setShow] = useState(false);
	const [Image, setImage] = useState(null);
	const [data, setData] = useState([]);
    const [history, setHistory] = useState([])
	const [status, setStatus] = useState("payment pending");

	const { id } = useSelector((state) => {
		return {
			id: state.user.user.id_user,
		};
	});

    React.useEffect(()=>{
        const getHistory = async () => {
            let res = await axios.get(`http://localhost:1000/order/getOrder/${id}`)
            setHistory(res.data);
        }
        getHistory()
    },[status])

	React.useEffect(() => {
		let result = history.filter((item) => item.status_name === status);
		setData(result);
	}, [status]);


	const tablePayment = () => {
		return data.map((item, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{item.name}</td>
					<td style={{ width: 150 }}>
						<img src={item.image} height="100px" />
					</td>
					<td style={{ width: 100 }}>{item.quantity}</td>
					<td>{item.total.toLocaleString()}</td>
				</tr>
			);
		});
	};

    const tableHistory = () => {
        return history.map((item, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{item.name}</td>
					<td style={{ width: 150 }}>
						<img src={item.image} height="100px" />
					</td>
					<td style={{ width: 100 }}>{item.quantity}</td>
					<td>{item.total.toLocaleString()}</td>
				</tr>
			);
		});
    }

	const totalPrice = () => {
		let counter = 0;
		data.map((item) => (counter += item.total));
		return counter;
	};

	const renderModal = () => {
		return (
			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Upload Buktibayar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.File id="formcheck-api-regular">
						<Form.File.Label>Upload Bukti Bayar</Form.File.Label>
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
        const order = parseInt(data[0].no_order)
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
			)
            setData([])
            setShow(false)
            alert("Upload Success")
            
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div style={{ padding: 30 }}>
			<Tab.Container id="left-tabs-example" defaultActiveKey="1">
				<Row>
					<Col sm={3} style={{ border: "1px solid black" }}>
						<Nav variant="pills" className="flex-column">
							<Nav.Item>
								<Nav.Link
									onClick={() => setStatus("payment pending")}
									eventKey="1"
								>
									Payment Pending
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link onClick={() => setStatus("order confirm")} eventKey="2">
									Order Paid
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link onClick={() => setStatus("delivered")} eventKey="3">Delivered</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="5">All History</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>
					<Col sm={9}>
						<Tab.Content>
							<Tab.Pane eventKey="1">
                                {data.length !== 0 ? (
								<Accordion>
									<Card>
										<Card.Header>
											<Accordion.Toggle as={Button} variant="link" eventKey="0">
												{data[0].no_order}
											</Accordion.Toggle>
											<Button variant="primary" onClick={() => setShow(true)}>
												Upload your payment here
											</Button>
											{renderModal()}
										</Card.Header>
										<Accordion.Collapse eventKey="0">
											<Table striped bordered hover>
												<thead>
													<tr>
														<th>#</th>
														<th>Product</th>
														<th>Images</th>
														<th>Quantity</th>
														<th>Total Price</th>
													</tr>
												</thead>
												<tbody>
													{tablePayment()}
													<tr>
														<td colSpan="4">
															Grand Total
														</td>
														<td>
															{totalPrice().toLocaleString()}
														</td>
													</tr>
												</tbody>
											</Table>
										</Accordion.Collapse>
									</Card>
								</Accordion>
                                ) : ( <h1>No History</h1>)}
							</Tab.Pane>
							<Tab.Pane eventKey="2">
                                {data.length !== 0 ? (
								<Accordion>
									<Card>
										<Card.Header>
											<Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            {data[0].no_order}
											</Accordion.Toggle>
										</Card.Header>
										<Accordion.Collapse eventKey="0">
                                        <Table striped bordered hover>
												<thead>
													<tr>
														<th>#</th>
														<th>Product</th>
														<th>Images</th>
														<th>Quantity</th>
														<th>Total Price</th>
													</tr>
												</thead>
												<tbody>
													{tablePayment()}
													<tr>
														<td colSpan="4">
															Grand Total
														</td>
														<td>
															{totalPrice().toLocaleString()}
														</td>
													</tr>
												</tbody>
											</Table>
										</Accordion.Collapse>
									</Card>
								</Accordion>

                                ) : ( <h1>No History</h1>)}
							</Tab.Pane>
							<Tab.Pane eventKey="3">
                            {data.length !== 0 ? (
								<Accordion>
									<Card>
										<Card.Header>
											<Accordion.Toggle as={Button} variant="link" eventKey="0">
												Click me!
											</Accordion.Toggle>
										</Card.Header>
										<Accordion.Collapse eventKey="0">
                                        <Table striped bordered hover>
												<thead>
													<tr>
														<th>#</th>
														<th>Product</th>
														<th>Images</th>
														<th>Quantity</th>
														<th>Total Price</th>
													</tr>
												</thead>
												<tbody>
													{tablePayment()}
													<tr>
														<td colSpan="4">
															Grand Total
														</td>
														<td>
															{totalPrice().toLocaleString()}
														</td>
													</tr>
												</tbody>
											</Table>
										</Accordion.Collapse>
									</Card>
								</Accordion>

                                ) : ( <h1>No History</h1>)}
							</Tab.Pane>
							<Tab.Pane eventKey="5">
                            {history.length !== 0 ? (
								<Accordion>
									<Card>
										<Card.Header>
											<Accordion.Toggle as={Button} variant="link" eventKey="0">
												{history[0].no_order} : {history[0].status_name}
											</Accordion.Toggle>
										</Card.Header>
										<Accordion.Collapse eventKey="0">
                                        <Table striped bordered hover>
												<thead>
													<tr>
														<th>#</th>
														<th>Product</th>
														<th>Images</th>
														<th>Quantity</th>
														<th>Total Price</th>
													</tr>
												</thead>
												<tbody>
													{tableHistory()}
													<tr>
														<td colSpan="4">
															Grand Total
														</td>
														<td>
															{totalPrice().toLocaleString()}
														</td>
													</tr>
												</tbody>
											</Table>
										</Accordion.Collapse>
									</Card>
								</Accordion>

                                ) : ( <h1>No History</h1>)}
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		</div>
	);
};

export default History;
