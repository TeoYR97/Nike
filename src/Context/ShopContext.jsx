import React from 'react'
import {products} from '../assets/assets'
import { createContext, useState } from 'react'


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'RM';
    const delivery_fee = 15;
    const [search,setSearch]=useState('');
    const [showSearch,setShowSearch]=useState(false);
    const[cartItems,setCartItem]=useState({});

    // const addToCart= async(itemId, size)=>{
    //     let cartData = structuredClone(cartItems);

    //     if(cartData[itemId]){
    //         if(cart)

    //     }
    // }

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch
    }
  return (
    <div>
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    </div>
  )
}

export default ShopContextProvider;