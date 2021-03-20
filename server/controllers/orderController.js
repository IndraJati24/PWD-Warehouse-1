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
	uploadBuktiBayar:async(req,res)=>{
		const no_order = parseInt(req.params.no_order)

        // console.log('req file', req.file)

        if (!req.file) return res.status(400).send('NO IMAGE')
		try {
			const updatePict = `UPDATE orders SET bukti_bayar = 'images/${req.file.filename}' 
                                WHERE no_order = ${no_order}`
            await asyncQuery(updatePict)

			const updateStatus = `update orders set status = 3 where no_order = ${no_order}`
			await asyncQuery(updateStatus)
            res.status(200).send("update berhasil")
		} catch (error) {
			console.log(error);
			res.status(200).send(400);
		}
	},
	getOrder: async(req, res)=>{
		const id = parseInt(req.params.id)
		try{
			const getOrder = `select * from orders o
			join order_details od using(no_order)
			join warehouse_product wp using(id_product) 
			join product p using(id_product)
			join order_status os on o.status = os.id_order_status
			where id_warehouse = o.warehouse and id_user = ${db.escape(id)}`

			const result = await asyncQuery(getOrder)
			res.status(200).send(result)
		}
		catch(err){
			console.log(err)
			res.status(400).send(err)
		}
	}
};
