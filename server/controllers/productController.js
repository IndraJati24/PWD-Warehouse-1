const db=require("../database")
const {asyncQuery}= require("../helpers/queryHelp")



module.exports={
    getAllProduct:async(req,res)=>{
        try {
            const queryProduct = `select *,sum(wp.stock) as total_stock from product p
            join warehouse_product wp on p.id_product=wp.id_product
            join kategori k on p.kategori=k.id_kategori
             group by p.id_product`
            const result= await asyncQuery(queryProduct)
            
            res.status(200).send(result)

        } catch (error) {
         console.log(error);   
         res.status(400).send(error)
        }
    },
    getAllCategory:async(req,res)=>{
        try {
            const queryCategory = `select * from kategori`
            const result= await asyncQuery(queryCategory)
            
            res.status(200).send(result)

        } catch (error) {
         console.log(error);   
         res.status(400).send(error)
        }
    },
    getDetailPage:async(req,res)=>{
        try {
            const queryProduct = `select *,sum(wp.stock) as total_stock from product p
            join warehouse_product wp on p.id_product=wp.id_product
            join kategori k on p.kategori=k.id_kategori
            where p.id_product=${db.escape(req.params.id)}
             group by p.id_product`
            const result= await asyncQuery(queryProduct)
            
            res.status(200).send(result[0])

        } catch (error) {
         console.log(error);   
         res.status(400).send(error)
        }
    },
}