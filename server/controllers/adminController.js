const { asyncQuery } = require("../helpers/queryHelp");

/**                   ====== PRODUCT ======                        */
async function getProducts(req, res) {
    try {
        const queryProduct = `select * from product`
        const result = await asyncQuery(queryProduct)

        res.status(200).send(result)

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

async function addProduct(req, res) {
    const { name, image, price, description } = req.body // kategori msh fixed
    try {
        const queryProduct = `INSERT INTO product (name, image, price, description, kategori)
                            VALUES
                            ('${name}', 'splash', ${price}, '${description}', 1)
        `
        console.log(queryProduct)
        const result = await asyncQuery(queryProduct)

        res.status(201).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
}

async function editProduct(req, res) {
    const { id } = req.params
    const { name, image, price, description } = req.body
    try {
        const queryProduct = `UPDATE product
                            SET name = '${name}', image = '${image}', description = '${description}', price = ${price}
                            WHERE id_product = ${id}
        `
        const result = await asyncQuery(queryProduct);

        console.log(result);
        res.status(200).send('updated');
    } catch (err) {
        res.status(400).send(err)
    }
}

async function deleteProduct(req, res) {
    const { id } = req.params
    try {
        const queryProduct = `DELETE FROM product WHERE id_product=${id}`;
        const result = await asyncQuery(queryProduct)
        console.log(result)
        res.status(200).send('deleted')
    } catch (err) {
        res.status(400).send(err)
    }
}

/**                   ====== CATEGORY ======                        */

async function getCategories(req, res) {
    try {
        const queryProduct = `SELECT * FROM kategori`;
        const result = await asyncQuery(queryProduct);

        res.status(200).send(result);
    } catch (err) {
        res.send(400).send(err)
    }
}

async function addCategory(req, res) {
    const { nama_kategori } = req.body // kategori msh fixed
    try {
        const queryProduct = `INSERT INTO kategori (nama_kategori)
                            VALUES
                            ('${nama_kategori}')
        `
        console.log(queryProduct)
        const result = await asyncQuery(queryProduct)

        res.status(201).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
}

async function editCategory(req, res) {
    const { id } = req.params
    const { nama_kategori } = req.body
    try {
        const queryProduct = `UPDATE kategori
                            SET nama_kategori = '${nama_kategori}'
                            WHERE id_kategori = ${id}
        `
        const result = await asyncQuery(queryProduct);

        console.log(result);
        res.status(200).send('updated');
    } catch (err) {
        res.status(400).send(err)
    }
}

async function deleteCategory(req, res) {
    const { id } = req.params
    try {
        const queryProduct = `DELETE FROM kategori WHERE id_kategori=${id}`;
        const result = await asyncQuery(queryProduct)
        console.log(result)
        res.status(200).send('deleted')
    } catch (err) {
        res.status(400).send(err)
    }
}

//Stock operasional per gudang
async function stockOperasional(req,res){
    try {
        const queryStockOperasional=`select wp.*,p.name nama_product,p.image,w.name from warehouse_product wp
        join product p on wp.id_product=p.id_product
        join warehouse w on wp.id_warehouse=w.id_warehouse;`
        const result= await asyncQuery(queryStockOperasional)

        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

//Stock operasional seluruh gudang
async function stockOperasionalAll(req,res){
    try {
        const queryStockOperasional=`select wp.*,p.name nama_product,p.image,w.name,sum(wp.stock_operasional) total from warehouse_product wp
        join product p on wp.id_product=p.id_product
        join warehouse w on wp.id_warehouse=w.id_warehouse group by wp.id_product;`
        const result= await asyncQuery(queryStockOperasional)

        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = { getProducts, addProduct, editProduct, deleteProduct, getCategories, addCategory, editCategory, deleteCategory,stockOperasional,stockOperasionalAll }