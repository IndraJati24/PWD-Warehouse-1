const { asyncQuery } = require("../helpers/queryHelp");
const db = require("../database")
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
    console.log(req.body)
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
async function stockOperasional(req, res) {
    try {
        const queryStockOperasional = `select wp.*,p.name nama_product,p.image,p.price,w.name,(p.price*wp.stock_sudah_kirim) total from warehouse_product wp
        join product p on wp.id_product=p.id_product
        join warehouse w on wp.id_warehouse=w.id_warehouse;`
        const result = await asyncQuery(queryStockOperasional)

        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

//Stock operasional seluruh gudang
async function stockOperasionalAll(req, res) {
    try {
        const queryStockOperasional = `select wp.*,p.name nama_product,p.image,w.name,sum(wp.stock_operasional) total from warehouse_product wp
        join product p on wp.id_product=p.id_product
        join warehouse w on wp.id_warehouse=w.id_warehouse group by wp.id_product;`
        const result = await asyncQuery(queryStockOperasional)

        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

async function getOrders(req, res) {
    try {
        const queryOrder = `SELECT o.*, a.username, a.city, os.status_name FROM orders o
                        join account a on a.id_user = o.id_user
                        join order_status os on os.id_order_status = o.status
        `;

        const result = await asyncQuery(queryOrder);

        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err)
    }
}

async function confirmationOrder(req, res) {
    const { no_order } = req.params
    const { isConfirm } = req.body
    try {
        if (isConfirm) {
            const queryOrder = `UPDATE orders
                SET status = 3
                WHERE no_order = '${no_order}'
            `
            await asyncQuery(queryOrder);


            const warehouseLoc = `select w.id_warehouse,w.name,w.latitude,w.longitude,w.location,wp.id_product,wp.stock, wp.stock_belum_kirim from warehouse w
            join warehouse_product wp on w.id_warehouse=wp.id_warehouse;`
            	let warehouse = await asyncQuery(warehouseLoc);
            	// console.log("lokasi gudang", warehouse)

            const Gudang = `select * from warehouse; `
            let semuaGudang = await asyncQuery(Gudang);
            // console.log("semua gudang",semuaGudang);

            const getLocationUserandProduct = `select od.id_order_details,od.no_order,od.id_product,od.quantity,o.warehouse,a.lat,a.lng from order_details od
            join orders o on o.no_order=od.no_order
            join account a on a.id_user=o.id_user
            where o.no_order='${no_order}'`
            	let cart = await asyncQuery(getLocationUserandProduct);
            	console.log("belanja", cart);

            	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            		var R = 6371; // Radius of the earth in km
            		var dLat = deg2rad(lat2 - lat1); // deg2rad below
            		var dLon = deg2rad(lon2 - lon1);
            		var a =
            			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            			Math.cos(deg2rad(lat1)) *
            			Math.cos(deg2rad(lat2)) *
            			Math.sin(dLon / 2) *
            			Math.sin(dLon / 2);
            		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            		var d = R * c; // Distance in km
            		return d;
            	}

            	function deg2rad(deg) {
            		return deg * (Math.PI / 180);
            	}

            	let distanceWarehouse = [];
            	semuaGudang.map((item) => {
            		return distanceWarehouse.push({
            			id_warehouse: item.id_warehouse,
            			name: item.name,
            			distance: getDistanceFromLatLonInKm(
            				cart[0].lat,
            				cart[0].lng,
            				item.latitude,
            				item.longitude
            			)
            		});
            	});

            	function urutDistance(a, b) {
            		if (a.distance < b.distance) {
            			return -1;
            		}
            		if (a.distance > b.distance) {
            			return 1;
            		}
            		return 0;
            	}

            	let gudangTerdekat = distanceWarehouse.sort(urutDistance);

            	gudangTerdekat.forEach(async (gudang) => {
            		warehouse.forEach(async (data) => {
            			if (gudang.id_warehouse == data.id_warehouse) {
            				cart.forEach(async (cart) => {
            					if (data.id_warehouse == cart.warehouse && data.id_product == cart.id_product) {
            						if (cart.quantity > data.stock) {
            							let sisa = cart.quantity - data.stock

            							let updateStock = `update warehouse_product set stock=0, stock_masuk=stock_masuk+${db.escape(sisa)}, stock_belum_kirim=stock_belum_kirim +${db.escape(cart.quantity)},stock_operasional=stock_operasional+${db.escape(sisa)} where id_product=${db.escape(cart.id_product)}
                                                      and id_warehouse=${db.escape(cart.warehouse)}`
            							await asyncQuery(updateStock)

            							for (let x = 1; x < gudangTerdekat.length; x++) {
            								let dataBaru = warehouse.filter(item => item.id_warehouse == gudangTerdekat[x].id_warehouse && item.id_product == cart.id_product)

            								if (sisa > dataBaru[0].stock) {
            									sisa -= dataBaru[0].stock

            									let updateStock = `update warehouse_product set stock=0, stock_keluar=stock_keluar+${db.escape(dataBaru[0].stock)},stock_operasional=0 where id_product=${db.escape(dataBaru[0].id_product)}
                                                      and id_warehouse=${db.escape(dataBaru[0].id_warehouse)}`
            									await asyncQuery(updateStock)
            								} else {

            									let updateStock = `update warehouse_product set stock=${db.escape(dataBaru[0].stock - sisa)}, stock_keluar =stock_keluar + ${db.escape(sisa)},stock_operasional=stock_operasional-${db.escape(sisa)} where id_product=${db.escape(dataBaru[0].id_product)}
                                                      and id_warehouse=${db.escape(dataBaru[0].id_warehouse)}`
            									await asyncQuery(updateStock)
            									break
            								}
            							}

            						} else {
                                        console.log("stock");
            							let updateStock = `update warehouse_product set stock=${db.escape(data.stock - cart.quantity)}, stock_belum_kirim=stock_belum_kirim +${db.escape(cart.quantity)} where id_product=${db.escape(cart.id_product)}
                                                      and id_warehouse=${db.escape(cart.warehouse)}`
            							await asyncQuery(updateStock)

            						}
            					}
            				})
            			}
            		})

            	})


            res.status(200).send('confirmed')
        } else {
            const queryOrder = `UPDATE orders
                SET status = 6
                WHERE no_order = '${no_order}'
            `

            await asyncQuery(queryOrder);
            res.status(200).send('canceled')
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports = { getProducts, addProduct, editProduct, deleteProduct, getCategories, addCategory, editCategory, deleteCategory, stockOperasional, stockOperasionalAll, getOrders, confirmationOrder }