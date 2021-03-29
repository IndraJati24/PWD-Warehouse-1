import React, { useState,useEffect } from 'react'
import axios from "axios"
import { Jumbotron, Container, Tabs, Tab,Image } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export default function StockOperasional() {
    const [key, setKey] = useState("gudangA")
    const [data, setData] = useState([])

    useEffect(() => {
        const getData=async()=>{
            try {
                const res = await axios.get('http://localhost:1000/admin/stockOperasional')
                setData(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }, [])

    const columnsOption = [{
        dataField: 'id_product',
        text: 'ID',
        sort: true
    }, {
        dataField: 'nama_product',
        text: 'Name Product',
        sort: true
    },{
        dataField: 'stock_sudah_kirim',
        text: 'Stock sudah dikirm',
        sort: true,
    }, {
        dataField: 'price',
        text: 'price',
        sort: true,
    },{
        dataField: 'total',
        text: 'total',
        sort: true,
    }, {
        dataField: 'image', text: 'Image', isDummyField: true, formatter: (cell, row) => (
            <Image src={row.image} alt="product" height="50" width="50" />
        )
    }]
    // console.log(data);
    const gudangA=data.filter(item=>item.id_warehouse===1)
    const gudangB=data.filter(item=>item.id_warehouse===2)
    const gudangC=data.filter(item=>item.id_warehouse===3)
    let totalPrice = (gudang) => {
		let counter = 0;
		gudang.forEach((item) => (counter += item.total));
		return counter;
	};
    return (
        <Jumbotron fluid className="m-3" >
            <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="gudangA" title="Gudang A">
                    <h3>Total : {totalPrice(gudangA).toLocaleString()}</h3>
                    <BootstrapTable keyField="id_product" data={gudangA} columns={columnsOption} pagination={paginationFactory()} />
                    </Tab>
                    <Tab eventKey="gudangB" title="Gudang B">
                    <h3>Total : {totalPrice(gudangB).toLocaleString()}</h3>
                    <BootstrapTable keyField="id_product" data={gudangB} columns={columnsOption} pagination={paginationFactory()} />
                    </Tab>
                    <Tab eventKey="gudangC" title="Gudang C" >
                    <h3>Total : {totalPrice(gudangC).toLocaleString()}</h3>
                    <BootstrapTable keyField="id_product" data={gudangC} columns={columnsOption} pagination={paginationFactory()} />
                    </Tab>

                </Tabs>
            </Container>
        </Jumbotron>
    )
}
