import React, { useState,useEffect } from 'react'
import axios from "axios"
import { Jumbotron, Container, Tabs, Tab } from "react-bootstrap";

import GudangA from "./GudangA";
import GudangB from "./GudangB";
import GudangC from "./GudangC";
import SemuaGudang from "./SemuaGudang";
export default function StockOperasional() {
    const [key, setKey] = useState("gudangA")
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])

    useEffect(() => {
        const getData=async()=>{
            try {
                const res = await axios.get('http://localhost:1000/admin/stockOperasional')
                const res2 = await axios.get('http://localhost:1000/admin/stockOperasionalAll')
                setData(res.data)
                setData2(res2.data)
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
                    <Tab eventKey="allGudang" title="All Gudang" >
                        <SemuaGudang data={data2} />
                    </Tab>
                </Tabs>
            </Container>
        </Jumbotron>
    )
}
