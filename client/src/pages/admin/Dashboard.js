import React from 'react'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import Category from './Category'
import Order from './Order'
import Product from './Product'
import StockOperasional from './StockOperasional'
import Penjualan from "./Penjualan";
import { Helmet } from 'react-helmet-async'
import {useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'


function Dashboard() {
    const {user} = useSelector((state) => state.user)
    if(user.id_role === 1 || !user.id_user) return <Redirect to="/"/>
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="product">
            <Helmet>
                <title>Admin | Warehouse</title>
            </Helmet>
            <Row>
                <Col sm={2} className="bg-dark p-4">
                    <Nav variant="pills" className="flex-column" style={{ marginBottom: '183%' }} >
                        <Nav.Item className="text-white" >
                            <h3>Admin</h3>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="product">Product</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="category">Category</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="order">Order</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="stock-operasional">Stock Operasional</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="penjualan">Penjualan</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={10}>
                    <Tab.Content>
                        <Tab.Pane eventKey="product">
                            <Product />
                        </Tab.Pane>
                        <Tab.Pane eventKey="category">
                            <Category />
                        </Tab.Pane>
                        <Tab.Pane eventKey="order">
                            <Order />
                        </Tab.Pane>
                        <Tab.Pane eventKey="stock-operasional">
                            <StockOperasional />
                        </Tab.Pane>
                        <Tab.Pane eventKey="penjualan">
                            <Penjualan />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default Dashboard
