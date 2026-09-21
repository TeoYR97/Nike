import React from 'react'
import { assets } from '../assets/assets'


const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <p>Contact Us</p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Call Us</p>
          <p className=' text-gray-500'>1-800-80-6453
            Products & Orders: 8:00 AM - 10:00 PM, Monday - Friday GMT+8
            8:00 AM - 5:00 PM, Saturday - Sunday GMT+8
            Company Info & Enquiries: 10:00 - 19:00, Monday - Friday</p>
          <p className=' text-gray-500'>Tel: (415) 555-0132 <br /> Email: admin@forever.com</p>
          </div>
      </div>


    </div>
  )
}

export default Contact