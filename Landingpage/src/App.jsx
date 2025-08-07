import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Eventcart from './Components/Eventcart'
import Service from './Components/Service'
import Banner from './Components/Banner'
import Footer from './Components/footer'

function App() {
  return (
    <div>
      <Header />
      <Eventcart/>
      <Service/>
      <Banner/>
      <Footer/>
    </div>
  )
}

export default App
