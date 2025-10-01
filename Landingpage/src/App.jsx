import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './Components/Header'
import Eventcart from './Components/Eventcart'
import Service from './Components/Service'
import Banner from './Components/Banner'
import Footer from './Components/Footer'
import About from "./Components/About";
import RegisterPersonal from "./Components/RegisterPersonal";
import RegisterPayment from "./Components/RegisterPayment";


// Dummy pages for now (you can replace with real components later)


function ServicePage() {
  return <Service />;
}

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/Header" element={<Header />} />
        <Route path="/Eventcart" element={<Eventcart />} />
        <Route path="/Service" element={<ServicePage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Register" element={<RegisterPersonal />} />
        <Route path="/Register/Payment" element={<RegisterPayment />} />


      </Routes>
      <Banner />
      <Footer />
    </Router>
  )
}

export default App;
