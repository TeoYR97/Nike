import React from 'react'
import {assets} from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex   flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm text-gray-500'>
        <div>
            <img src={assets.exchange_icon} alt="Our Policy" className="w-12 m-auto mb-5"/>
            <p className="font-medium">Easy Exchange Policy</p>
            <p className="font-medium text-gray-400">We offer hassle free exchange policy</p>
        </div>

        <div>
            <img src={assets.quality_icon} alt="" className="w-12 m-auto mb-5"/>
            <p className="font-medium">7 Day Return Policy</p>
            <p className="font-medium text-gray-400">We offer hassle free return policy</p>
        </div>

        <div>
            <img src={assets.support_img} alt="" className="w-12 m-auto mb-5"/>
            <p className="font-medium">Help</p>
            <p className="font-medium text-gray-400">30 Days Free Return</p>
        </div>
    </div>
  )
}

export default OurPolicy