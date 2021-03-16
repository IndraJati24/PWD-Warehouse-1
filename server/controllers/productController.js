const db=require("../database")
const {asyncQuery}= require("../helpers/queryHelp")



module.exports={
    getAllProduct:async(req,res)=>{
        try {
            const queryProduct = `select * from product p join kategori k on p.kategori=k.id_kategori`
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
    }
}