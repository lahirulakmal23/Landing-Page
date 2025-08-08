import React from 'react';
import temple from '../assets/images/temple.jpg';
import aluthkalawa from "../assets/images/aluthkalawak.png";
import handawaka from '../assets/images/handawa.png';
import nadagama from '../assets/images/Nadagama.png';
import awarekaAle from '../assets/images/Awareka Ale.png';


function Eventcart() {
  const events = [
    { title: 'Asela Perahara', image: temple },
    { title: 'Aluth kalawa', image: aluthkalawa },
    { title: 'Handawaka', image:  handawaka },
    { title: 'nadagama', image: nadagama },
    { title: 'Awareka Ale', image:awarekaAle },
  ];

  return (
    <div className="px-6 md:px-10 py-10  relative z-20 -top-20">
      <div className="flex flex-wrap justify-center gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-[white] to-[#dbd9d9]  rounded-md shadow-lg w-50   p-4 flex flex-col items-center transform transition relative  hover:scale-105"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-50 w-full object-cover rounded-md mb- z-30 -top-20 relative"
            />
            <h2 className="text-black text-md font-semibold text-center">
              {event.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Eventcart;
