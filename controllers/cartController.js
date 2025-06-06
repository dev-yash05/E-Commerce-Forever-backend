//Add products to user cart

import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        
        const {userId,itemId,size} = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;


        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1; // Increment quantity if item already exists
            }else{
                cartData[itemId][size] = 1; // Add new size with quantity 1
            }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId,{cartData});

        res.json({
            success: true,
            message: 'Item added to cart successfully'
        });


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
        
    }
}

//update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (quantity === 0) {
      // Remove the size from the item
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        // If no sizes left for this item, remove the item
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      // Update the quantity of the item
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
}


//get user cart
const getUserCart = async (req, res) => {

 try {
    
    const{userId} = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({
        success: true,
        message: 'Cart fetched successfully',
        cartData
    });

 } catch (error) {
    console.log(error);
    res.json({
        success: false,
        message: error.message
    });
 }

}


export {
    addToCart,
    updateCart,
    getUserCart
}