import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing orders using COD method

const placeOrder = async (req, res) => {
    
    try {
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:'COD',
            payment:false,
            date: Date.now(),
        }
        const newOrder = await new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}});

        res.json({
            success: true,
            message: "Order Placed"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
        
    }

}
const placeOrderStripe = async (req, res) => {

}
const placeOrderRazorpay = async (req, res) => {

}


//All orders data for admin panel

const allOrders = async (req, res) => {

}


//user orders data for frontend panel

const userOrders = async (req, res) => {
    try {
        const {userId} = req.body;

        const orders  = await orderModel.find({userId});
        res.json({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
        
    }
}


//update order status by admin

const updateStatus = async (req, res) => {

}




export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus
}