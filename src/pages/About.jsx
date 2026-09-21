import React from 'react'
import { assets } from '../assets/assets'
import Footer from '../components/Footer'


const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <p>About Nike</p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Nike is a global sportswear brand built around innovation, performance, and the belief that everyone has the potential to be an athlete. From running shoes and training apparel to lifestyle products, Nike creates products designed to help people move, perform, and express themselves with confidence.</p>

          <p>Founded with a passion for sport and innovation, Nike has grown into one of the world's most recognized sports brands. Over the years, the company has continued to push the boundaries of design and technology, developing products that combine comfort, performance, and modern style.</p>

          <p>At Nike, innovation is at the heart of everything we do. We continuously explore new materials, technologies, and designs to create products that help athletes perform at their best. Whether you're training for a competition, going for a run, working out at the gym, or simply enjoying an active lifestyle, our products are designed to support you every step of the way.</p>

          <p>Nike is also more than just sportswear. The brand has become an important part of modern culture, bringing together sport, fashion, creativity, and self-expression. From iconic footwear to everyday apparel, Nike products are worn by professional athletes and people around the world.</p>

          <p>Our mission is to bring inspiration and innovation to every athlete in the world. We believe that sport has the power to bring people together, encourage healthy lifestyles, and inspire individuals to challenge their limits.</p>

          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is simple: to bring inspiration and innovation to every athlete in the world.</p>
        </div>
      </div>

      <div className=' text-xl py-4'>
        <p>Why Choose Us</p>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          
          <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>
      </div>


    <Footer/>
    </div>
  )
}

export default About