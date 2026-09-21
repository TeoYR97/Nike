import React from 'react'
import Background from '../components/Background'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import Newbie from '../components/Newbie'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Newbie/>
      <Background/>
      <LatestCollection/>
      <BestSeller/>
      <Footer/>
    </div>
  )
}

export default Home