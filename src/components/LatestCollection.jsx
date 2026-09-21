import React from 'react'
import { useContext,useState, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import ProductItem from './ProductItem'

const LatestCollection = () => {

    const {products} = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 5));
    }, [])

    return (
        <div className="my-10">
            <div className="flex items-center justify-center gap-4 py-8 text-3xl font-semibold text-gray-700">

                <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-500"></p>

                <p className="prata-regular">Latest Collection</p>

                <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-500"></p>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    latestProducts.map((item,index)=>(
                        <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>

            

        </div>
    )
}

export default LatestCollection