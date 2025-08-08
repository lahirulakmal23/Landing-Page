import React from 'react';
import shieldImage from '../assets/images/temple.jpg'; 
import { VscGraphLine } from "react-icons/vsc";
import { ChartSpline } from 'lucide-react';


function Banner() {
  return (
    <div className='grid grid-cols-2 gap-10 bg-gradient-to-b from-[#111B44] to-[#1A2250] text-white p-10 rounded-xl mx-10 mt-10'>

      {/* Left Side */}
      <div className='flex flex-col justify-between space-y-8 px-8'>
      
        <div>
          <h2 className="text-4xl font-bold mb-8 ">
            <span className="text-orange-400">CrowdFlow</span> is fully GDPR <br />Compliant
          </h2>
          <p className="text-md text-gray-300 mt-2 opacity-60">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam quidem explicabo eius autem ducimus. Dolore earum voluptas recusandae nemo alias enim commodi hic, exercitationem sint mollitia cum nulla libero magnam!
            Our technology protects privacy while delivering insights. We anonymize all data, avoid facial recognition, and never remove CCTV footage from your premises, ensuring complete regulatory compliance.
          </p>
        </div>

        {/* Cards */}
        <div className=" gap-4 m grid grid-rows-3 mt-8">
          <div className="bg-orange-400 text-white p-4 rounded-lg w-60 h-25 ">
            <p className="text-xs">Number of Visitors</p>
            <p className="text-3xl font-bold">150</p>
            <VscGraphLine className='w-10 h-10 flex mx-20 '/>  
           
            
          </div>
          <div className="bg-gray-200 text-black p-4 rounded-lg w-60 mx-40 relative z-20 -top-10 shadow-2xl">
            <p className="text-xs">Number of Visitors</p>
            <p className="text-3xl font-bold">14</p>
            <ChartSpline color='blue' size={30} className='relative left-40'/>
          </div>
          <div className="bg-gray-300 text-black p-4 rounded-lg w-60 relative z-20 -top-20 shadow-2xl">
            <p className="text-xs">Avg Time in Queue</p>
            <p className="text-3xl font-bold">3min</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='space-y-6'>
        <div className="rounded-lg overflow-hidden">
          <img
            src={shieldImage}
            alt="Security Shield"
            className="p-4 rounded-2xl  relative  w-120 "
          />
        </div>
        <div className='p-4'>
          <h2 className="text-4xl font-bold">
            <span className="text-orange-400">Real-Time</span> Monitoring &amp; Analysis
          </h2>
          <p className="text-md text-gray-300 mt-6 opacity-60 ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis eaque sequi tempora ipsam incidunt assumenda obcaecati tenetur hic esse? Molestiae consequuntur mollitia in impedit minus sunt adipisci dolorum laborum odit.   Gain instant insights in real-time, allowing you to make quick, informed decisions and optimize operations on the fly.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Banner;
