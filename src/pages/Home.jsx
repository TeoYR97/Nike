import React from 'react'
import Background from '../components/Background'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Newbie from '../components/Newbie'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Newbie/>
      <Background/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <Footer/>
    </div>
  )
}

export default Home