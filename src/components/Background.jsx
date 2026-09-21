import React from 'react'
import { assets } from '../assets/assets'

const Background = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <video   src={assets.background}   autoPlay   loop   muted   playsInline   className="border-2 border-gray-600"/>
    </div>
  )
}

export default Background