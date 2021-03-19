const { asyncQuery, generateQuery } = require('../helpers/queryHelp')
const db = require('../database')



module.exports={
    addCart: async (req, res) => {
        let { no_order, id_user, id_product, quantity, total, date } = req.body
        try {
            // check order user
            const checkOrder = `SELECT * FROM orders WHERE id_user = ${db.escape(id_user)} AND status = 1`
            const check = await asyncQuery(checkOrder)

            no_order = check.length !== 0 ? check[0].no_order : no_order

            if (check.length === 0) {

                // insert into table orders
                const addOrders = `INSERT INTO orders (no_order, id_user, status, warehouse, date) VALUES
                (${db.escape(no_order)}, ${db.escape(id_user)}, 1, 1, ${db.escape(date)})`
                const result = await asyncQuery(addOrders)
            }

            const checkOrder_details = `SELECT * FROM order_details WHERE no_order = ${db.escape(no_order)} AND id_product = ${db.escape(id_product)}`
            const check2 = await asyncQuery(checkOrder_details)

            if (check2.length===0) {
                // insert into table order_details
                const addDetail = `INSERT INTO order_details (no_order, id_product, quantity, total) VALUES 
                                    (${db.escape(no_order)}, ${db.escape(id_product)}, ${db.escape(quantity)}, ${db.escape(total)})`
                const result2 = await asyncQuery(addDetail)
    
                res.status(200).send('Add to cart success')
                
            } else {
                const updateDetail=`UPDATE order_details SET quantity=(quantity+${quantity}),total=(total+${total}) WHERE id_product= ${db.escape(id_product)} and no_order=${db.escape(no_order)}; `
                const result3 = await asyncQuery(updateDetail)
                res.status(200).send('Add to cart success')
            }

        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
     getCart: async (req, res) => {
        const id = (req.params.id)
        try {
            const getCart = `select *, sum(wp.stock) as total_stock from orders o
            join order_details od on o.no_order = od.no_order
            join warehouse_product wp on wp.id_product = od.id_product
            join product p on od.id_product=p.id_product
            join order_status os on os.id_order_status=o.status
            where o.status=1 and o.id_user = ${db.escape(id)}
			group by od.id_product`

            const result = await asyncQuery(getCart)

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    editCart: async (req, res) => {
        const id = Number(req.params.id)
        const { quantity, total, no_order } = req.body

        try {
            const editQty = `UPDATE order_details SET quantity = ${db.escape(quantity)}, total = ${db.escape(total)}
                            WHERE id_product = ${db.escape(id)} AND no_order = ${db.escape(no_order)}`
            await asyncQuery(editQty)

            res.status(200).send(`edit cart for id_product ${id} success`)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    deleteCart: async (req,res)=>{
        const id = (req.params.id)
        try{
            const delQuery = `DELETE FROM order_details where id_order_details = ${db.escape(id)}`
            await asyncQuery(delQuery)

            res.status(200).send('Delete Success')
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}