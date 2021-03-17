import React, { Component } from "react";
import { connect } from "react-redux";
import {Button, Table} from 'react-bootstrap'
import Axios from "axios";

class CartPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};
	}

	componentDidMount() {
		Axios.get(`http://localhost:1000/cart/getCart/${this.props.id}`)
			.then((res) => {
				this.setState({ data: res.data });
				// console.log(res.data)
			})

			.catch((err) => console.log(err));
	}

    tableBody =()=>{
        return this.state.data.map((item, index) => {
            return(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td style={{width: 150}}><img src={item.image} height="100px"/></td>
                    <td>{item.price.toLocaleString()}</td>
                    <td style={{width: 100}}>{item.quantity}</td>
                    <td>{item.total.toLocaleString()}</td>
                    <td style={{width: 170}}>
                        <div style={{display:'flex', justifyContent: 'space-around'}}>
                        <Button variant="warning"><i class="fas fa-edit"></i></Button>
                        <Button variant="danger"><i class="fas fa-trash"></i></Button>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    totalPrice = () => {
        let counter = 0;
        this.state.data.map((item) => (counter += item.total));
        return counter;
      };

	render() {
		return (
			<div style={{ padding: "10px 30px" }}>
				<div style={{display: "flex", justifyContent:"space-between"}}>
					<h2>Hello {this.props.username} this is your cart</h2>
                    <Button variant="success">Checkout</Button>
				</div>
				<div style={{marginTop: 20}}>
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
                            <td colSpan="5" style={styles.total}>Grand Total</td>
                            <td style={styles.total}>{this.totalPrice().toLocaleString()}</td>
                            </tr>
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

const styles={
    total: {
        backgroundColor:'blue', fontSize: 20, color: 'white'
    }
}

const mapStateToProps = (state) => {
	return {
		id: state.user.id_user,
		username: state.user.username,
	};
};
export default connect(mapStateToProps)(CartPage);
