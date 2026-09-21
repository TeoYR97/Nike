import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react';
import { ShopContext } from '../Context/ShopContext';

const Navbar = () => {
  const [visible, setVisiible] = useState(false);
  const {setShowSearch}=useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <NavLink to="/">
        <img  src={assets.logo} alt="logo" className="w-10 h-10" />
      </NavLink>

      <ul className="hidden sm:flex gap-5 text-sm text-grey-500">

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-500 hidden" />
        </NavLink>

        <NavLink to="/Men" className="flex flex-col items-center gap-1">
          <p>MEN</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-500 hidden" />
        </NavLink>

        <NavLink to="/Women" className="flex flex-col items-center gap-1">
          <p>WOMEN</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-500 hidden" />
        </NavLink>

        <NavLink to="/Kids" className="flex flex-col items-center gap-1">
          <p>KIDS</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-500 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" />

        <img src={assets.profile_icon} className="w-5 cursor-pointer" />

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5 cursor-pointer" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">10</p>
        </Link>
        <img onClick={() => setVisiible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" />
      </div>

      {/*Side menu*/}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-500">
          <div onClick={()=>setVisiible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img src={assets.dropdown_icon} className='h-4 rotate-180'/>
            <p>Back</p>
          </div>
          <NavLink onClick={()=>setVisiible(false)} className="py-2 pl-6 border " to="/collection">Collection</NavLink>
          <NavLink onClick={()=>setVisiible(false)} className="py-2 pl-6 border " to="/men">Men</NavLink>
          <NavLink onClick={()=>setVisiible(false)} className="py-2 pl-6 border " to="/women">Women</NavLink>
          <NavLink onClick={()=>setVisiible(false)} className="py-2 pl-6 border " to="/kids">Kids</NavLink>
        </div>

      </div>
    </div>
  )
}

export default Navbar