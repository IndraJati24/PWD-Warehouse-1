import React from 'react'
import { Image } from "react-bootstrap";

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
export default function GudnagB({ data }) {
    const columnsOption = [{
        dataField: 'id_product',
        text: 'ID',
        sort: true
    }, {
        dataField: 'nama_product',
        text: 'Name Product',
        sort: true
    }, {
        dataField: 'stock_operasional',
        text: 'Stock Operasional',
        sort: true,
    }, {
        dataField: 'image', text: 'Image', isDummyField: true, formatter: (cell, row) => (
            <Image src={row.image} alt="product" height="50" width="50" />
        )
    }]
    return (
        <div>
            <h3 style={{ margin: "1rem 1rem" }}>Gudang B</h3>
            <BootstrapTable keyField="id_product" data={data ? data : []} columns={columnsOption} pagination={paginationFactory()} />

        </div>
    )
}
