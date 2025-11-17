import customerCreation from "../models/customerCreation.js";


export const createCustomer = async(req , res)=>{
    try {
        const {name, phone, groupNo, email, address} = req.body;
        if(!name || !phone || !groupNo || !email || !address){
            return res.status(400).json({message:"All fields are required  "})
        }
        const newCustomer = new customerCreation({
            name,
            phone,
            groupNo,
            email,
            address
        });
        await newCustomer.save();
        return res.status(201).json(newCustomer);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error "})
    }
}


export const getAllCustomers = async(req,res)=>{
    try {
        const customers = await customerCreation.find({})
        if(!customers){
            return res.status(404).json({message:"No customers found"})
        }
        return res.status(200).json(customers);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}