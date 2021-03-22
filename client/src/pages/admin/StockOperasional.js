import React, { useState,useEffect } from 'react'
import axios from "axios"
import { Jumbotron, Container, Tabs, Tab } from "react-bootstrap";

import GudangA from "./GudangA";
import GudangB from "./GudangB";
import GudangC from "./GudangC";
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
    // console.log(data);
    const gudangA=data.filter(item=>item.id_warehouse===1)
    const gudangB=data.filter(item=>item.id_warehouse===2)
    const gudangC=data.filter(item=>item.id_warehouse===3)
    
    return (
        <Jumbotron fluid className="m-3" >
            <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="gudangA" title="Gudang A">
                        <GudangA data={gudangA} />
                    </Tab>
                    <Tab eventKey="gudangB" title="Gudang B">
                        <GudangB data={gudangB}/>
                    </Tab>
                    <Tab eventKey="gudangC" title="Gudang C" >
                        <GudangC data={gudangC} />
                    </Tab>
                </Tabs>
            </Container>
        </Jumbotron>
    )
}
