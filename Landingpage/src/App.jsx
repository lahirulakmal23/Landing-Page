import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'
import Eventcart from './Components/Eventcart'
import Service from './Components/Service'
import Banner from './Components/Banner'
import Footer from './Components/Footer'
import About from "./Components/About";


// Dummy pages for now (you can replace with real components later)


function ServicePage() {
  return <Service />;
}

function App() {
  return (
    <Router>
      <Header /> 
      <Eventcart />
      <Routes>
        <Route path="/Header" element={<Header />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/About" element={<About />} />
      </Routes>
      <Banner />
      <Footer />
    </Router>
  )
}

export default App;
