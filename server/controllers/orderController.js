const { asyncQuery, generateQuery } = require("../helpers/queryHelp");
const db = require("../database");

module.exports = {
	getWarehouseLoc: async (req, res) => {
		const { no_order, lat, lng } = req.body;

		try {
			const warehouseLoc = `select * from warehouse`;
			let warehouse = await asyncQuery(warehouseLoc);

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
			warehouse.map((item) => {
				return distanceWarehouse.push({
					id: item.id_warehouse,
					name: item.name,
					distance: getDistanceFromLatLonInKm(
						lat,
						lng,
						item.latitude,
						item.longitude
					),
					location: item.location,
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
			
			const updateWarehouse = `update orders set warehouse = ${db.escape(gudangTerdekat[0].id)}, status= 2 
                                    where no_order = ${db.escape(no_order)}`
			await asyncQuery(updateWarehouse)
			res.status(200).send("update sukses");
		} catch (err) {
			console.log(err);
			res.status(200).send(400);
		}
	},
	uploadBuktiBayar: async (req, res) => {
		const no_order = parseInt(req.params.no_order)

		// console.log('req file', req.file)

		if (!req.file) return res.status(400).send('NO IMAGE')
		try {
			const updatePict = `UPDATE orders SET bukti_bayar = 'images/${req.file.filename}' 
                                WHERE no_order = ${no_order}`
			await asyncQuery(updatePict)

			const updateStatus = `update orders set status = 3 where no_order = ${no_order}`
			await asyncQuery(updateStatus)

			const warehouseLoc = `select w.id_warehouse,w.name,w.latitude,w.longitude,w.location,wp.id_product,wp.stock, wp.stock_belum_kirim from warehouse w
			join warehouse_product wp on w.id_warehouse=wp.id_warehouse;`
			let warehouse = await asyncQuery(warehouseLoc);
			// console.log("lokasi gudang", warehouse)

			const Gudang=`select * from warehouse; `
			let semuaGudang = await asyncQuery(Gudang);

			const getLocationUserandProduct = `select od.id_order_details,od.no_order,od.id_product,od.quantity,o.warehouse,a.lat,a.lng from order_details od
			join orders o on o.no_order=od.no_order
			join account a on a.id_user=o.id_user
			where o.no_order=${db.escape(no_order)};`
			let cart = await asyncQuery(getLocationUserandProduct);
			console.log("belanja",cart);

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
		
			 gudangTerdekat.forEach(async(gudang) => {
				 warehouse.forEach(async(data)=>{
					if(gudang.id_warehouse==data.id_warehouse){
						
						cart.forEach(async(cart) => {
						
							if (data.id_warehouse == cart.warehouse && data.id_product == cart.id_product) {
								if (cart.quantity > data.stock)  {
									let sisa = cart.quantity - data.stock
									
									let updateStock = `update warehouse_product set stock=0, stock_masuk=${db.escape(sisa)}, stock_belum_kirim=${db.escape(cart.quantity)}, stock_operasional=${db.escape(data.stock + data.stock_belum_kirim)} where id_product=${db.escape(cart.id_product)}
													  and id_warehouse=${db.escape(cart.warehouse)}`
									await asyncQuery(updateStock)
		
									for (let x = 1; x < gudangTerdekat.length; x++) {
										let dataBaru=warehouse.filter(item=> item.id_warehouse== gudangTerdekat[x].id_warehouse && item.id_product==cart.id_product )
										
										if (sisa > dataBaru[0].stock) {
											sisa -= dataBaru[0].stock
									
											let updateStock = `update warehouse_product set stock=0, stock_keluar=${db.escape(dataBaru[0].stock)} where id_product=${db.escape(dataBaru[0].id_product)}
													  and id_warehouse=${db.escape(dataBaru[0].id_warehouse)}`
											let update = await asyncQuery(updateStock)
										}else{

											let updateStock = `update warehouse_product set stock=${db.escape(dataBaru[0].stock-sisa)}, stock_keluar = ${db.escape(sisa)} where id_product=${db.escape(dataBaru[0].id_product)}
													  and id_warehouse=${db.escape(dataBaru[0].id_warehouse)}`
											let update = await asyncQuery(updateStock)
											break
										}
									}
		
								} else {
									
									let updateStock = `update warehouse_product set stock=${db.escape(data.stock - cart.quantity)}, stock_belum_kirim=${db.escape(data.stock_belum_kirim + cart.quantity)} where id_product=${db.escape(cart.id_product)}
													  and id_warehouse=${db.escape(cart.warehouse)}`
									await asyncQuery(updateStock)

								}
							}
						})
					}
				 })
				
			})

			res.status(200).send("update berhasil")
		} catch (error) {
			console.log(error);
			res.status(200).send(400);
		}
	},
	getOrder: async (req, res) => {
		const id = parseInt(req.params.id)
		try {
			const getOrder = `select * from orders o
			join order_details od using(no_order)
			join warehouse_product wp using(id_product) 
			join product p using(id_product)
			join order_status os on o.status = os.id_order_status
			where id_warehouse = o.warehouse and id_user = ${db.escape(id)}`

			const result = await asyncQuery(getOrder)
			res.status(200).send(result)
		}
		catch (err) {
			console.log(err)
			res.status(400).send(err)
		}
	},
	getAllOrder: async (req, res) => {
		const id = parseInt(req.params.id)
		try {
			const getOrder = `select * from orders o
			join order_status os on o.status = os.id_order_status 
			where id_user = ${db.escape(id)}`

			const result = await asyncQuery(getOrder)
			res.status(200).send(result)
		}
		catch (err) {
			console.log(err)
			res.status(400).send(err)
		}
	},
	cancelPaymentPending : async(req, res) => {
		const id = parseInt(req.params.id)
		
		try{
			const cancelOrder = `update orders set status = 6 where no_order =${db.escape(id)}`
			await asyncQuery(cancelOrder)
			res.status(200).send("cancel berhasil")
		}
		catch(err) {
			console.log(err)
			res.status(400).send(err)
		}
	},
	cancelOrderConfirm: async(req, res) => {
		const id = parseInt(req.params.id)
		try{
			const cancelOrder = `update orders set status = 6 where no_order =${db.escape(id)}`
			await asyncQuery(cancelOrder)

			const getOrders = `select * from orders o
			join order_details od using (no_order)
			join warehouse_product wp using(id_product)
			where o.no_order = ${id} and wp.id_warehouse = o.warehouse`
			const result = await asyncQuery(getOrders)

			const gudang = `select * from warehouse_product where id_warehouse = ${result[0].warehouse}`
			const result2 = await asyncQuery(gudang)
			result.forEach(async(cart)=>{
				result2.forEach(async(gudang)=>{
					if(cart.id_product === gudang.id_product && cart.warehouse === gudang.id_warehouse){
						const updateStock = `update warehouse_product set stock=${gudang.stock + cart.quantity}, stock_belum_kirim=${gudang.stock_belum_kirim - cart.quantity}`
						await asyncQuery(updateStock)
					}
				})
			})

			res.status(200).send("update berhasil")
		}
		catch(err) {
			console.log(err)
			res.status(400).send(err)
		}
	},
	orderArrived: async(req, res) => {
		const id = parseInt(req.params.id)
		try{
			const arrivedOrder = `update orders set status = 5 where no_order =${db.escape(id)}`
			await asyncQuery(arrivedOrder)

			res.status(200).send("update berhasil")
		}
		catch(err){
			console.log(err)
			res.status(400).send(err)
		}
	}
};
