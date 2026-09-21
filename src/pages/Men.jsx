import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from '../components/ProductItem'

const Men = () => {

  const { products,search,showSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const[category, setCategory] = useState([]);
  const[subCategory, setSubCategory] = useState([]);
  const [sortType,setsortType]=useState("relavent");

  // const toggleCategory = (e) => {
  //   if(category.includes(e.target.value)){
  //     setCategory(prev=>prev.filter(item => item !== e.target.value));
  //   } else {
  //     setCategory(prev=>[...prev, e.target.value]);
  //   }
  // }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=>prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev=>[...prev, e.target.value]);
    }
  }

  const applyFilter=() => {
    let productsCopy = products.filter(item => item.category === "Men");

    if(showSearch && search){
      productsCopy = productsCopy.filter((item=>item.name.toLowerCase().includes(search.toLowerCase())))
    }

    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if(subCategory.length>0){
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  }

  const sortProduct =()=>{

    let filterCopy=filterProducts.slice();

    switch(sortType){
      case 'low-high':
      setFilterProducts(filterCopy.sort((a,b)=>(a.price-b.price)));
      break;

      case 'high-low':
      setFilterProducts(filterCopy.sort((a,b)=>(b.price-a.price)));
      break;

      default:
        applyFilter();
        break;
    }

  }


  useEffect(() => {
    applyFilter();
  },[category,subCategory,search,showSearch]);

  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-1 border-t border-gray-300 ">

      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2 pt-7">Filter
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </p>
        {/*Category filter*/}
        {/* <div className={`border-gray-300 border pl-5 py-2 mt-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
            <p className="flex gap-2">
              <input onChange={toggleCategory} className="w-3 " type="checkbox" value={"Men"} />Men
            </p>
            <p className="flex gap-2">
              <input onChange={toggleCategory} className="w-3 " type="checkbox" value={"Women"} />Women
            </p>
            <p className="flex gap-2">
              <input onChange={toggleCategory} className="w-3 " type="checkbox" value={"Kids"} />Kids
            </p>
          </div>
        </div> */}

        {/*Subcategory filter*/}
        <div className={`border-gray-300 border pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
            <p className="flex gap-2">
              <input onChange={toggleSubCategory} className="w-3 " type="checkbox" value={"Topwear"} />Topwear
            </p>
            <p className="flex gap-2">
              <input onChange={toggleSubCategory} className="w-3 " type="checkbox" value={"Bottomwear"} />Bottomwear
            </p>
            <p className="flex gap-2">
              <input onChange={toggleSubCategory} className="w-3 " type="checkbox" value={"Shoe"} />Shoe
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 ">
        <div className="flex justify-between text-base sm:text-2xl mb-4 pt-4">

          <p className="prata-regular my-2 gap-2">Men Collection</p>
          <select onChange={(e)=>setsortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {
            filterProducts.map((item, index) => (
              <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>

      </div>



    </div>
  )
}

export default Men