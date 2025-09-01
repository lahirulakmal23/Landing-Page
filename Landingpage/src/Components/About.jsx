import React from 'react';

const About = () => {
  // Team member data
  const teamMembers = [
    {
      name: "Nisindu Lokuhewage",
      role: "Team Lead",
      image: "/nisindu.jpeg"
    },
    {
      name: "Haritha Pawan", 
      role: "Project Manager",
      image: "/pawan.jpeg"
    },
    {
      name: "Devindi Karunanayake",
      role: "Software Engineer", 
      image: "/devindi.jpeg"
    },
    {
      name: "Lahiru Lakmal",
      role: "Software Engineer",
      image: "/lahiru.jpeg"
    },
    {
      name: "Naveen Khan",
      role: "UI/UX Engineer",
      image: "/naveen.jpeg"
    }
  ];

  return (
    <div className= "bg-[#0F1139]">
    <div className="max-w-6xl mx-auto px-6 py-12 bg-[#0F1139]">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
      </div>

      {/* First Section */}
       {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">*/}
        <div className="lg:pr-8">
          <p className="text-lg text-white/70 leading-relaxed">
            At CrowdFlow, we take pride in being a modern, people-driven company that values quality, collaboration, and continuous growth. Founded by a passionate team of professionals, our mission is to bring a new standard of professionalism and creativity to everything we do. We believe that a great team is the foundation of any great company — and that belief is reflected in how we work, how we communicate, and how we grow together.

We focus on building strong partnerships, encouraging open communication, and creating a culture where everyone has the freedom to think, contribute, and lead. Every project we take on is approached with care, integrity, and a shared goal of delivering meaningful outcomes. At CrowdFlow, we don’t just work together — we learn from one another, we support one another, and we celebrate each success as a team.
          </p>
        </div>
        <div className="ml-20 grid grid-cols-1 lg:grid-cols-2 gap-1 items-center mb-12">
          <img 
            src="/about3.jpg" 
            alt="Team photo 2"
            className=" mt-8 mb-8 rounded-lg shadow-lg w-90 h-70 max-w-md"
          />

           <img 
            src="/about2.jpg" 
            alt="Team photo 1"
            className=" mt-8 mb-8 rounded-lg shadow-lg w-100 h-70 max-w-md"
          />
       {/* </div>
      </div>

       Second Section */}
      
     {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-20">*/} </div>
        <div className="lg:pr-8">
          <p className="text-lg text-white/70  leading-relaxed">
            At CrowdFlow, we take pride in being a modern, people-driven company that values quality, collaboration, and continuous growth. Founded by a passionate team of professionals, our mission is to bring a new standard of professionalism and creativity to everything we do. We believe that a great team is the foundation of any great company — and that belief is reflected in how we work, how we communicate, and how we grow together.

We focus on building strong partnerships, encouraging open communication, and creating a culture where everyone has the freedom to think, contribute, and lead. Every project we take on is approached with care, integrity, and a shared goal of delivering meaningful outcomes. At CrowdFlow, we don’t just work together — we learn from one another, we support one another, and we celebrate each success as a team.
          </p>
        </div>
   </div>
    
          {/* <div className="flex justify-center">
          <img 
            src="https://via.placeholder.com/400x300/E2E8F0/4A5568?text=Team+Photo+2" 
            alt="Team photo 2"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>
      </div>*/}
       
     {/* Meet Our Team Section */}

      <div className =" bg-[#FFFFFF]">
      <div className="text-center pt-16">
        <h2 className="text-5xl font-bold  mb-16">
          Meet Our <span className="text-orange-500">Team</span>
        </h2>

        {/* Team Members Grid */}
        <div className=" flex flex-wrap justify-center gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              {/* Profile Image */}
              <div className="w-32 h-32 mx-auto mb-4 shadow-2xl rounded-full object-cover">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover shadow-lg"
                />
              </div>
              
              {/* Name */}
              <h3 className="text-xl font-bold text-black mb-1">
                {member.name}
              </h3>
              
              {/* Role */}
              <p className="text-lg text-gray-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Why Choose Our System Section */}
<div className="bg-[#F0F6FF] mt-20 py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
      Why Choose Our System
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Feature 1 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">Enhanced Safety</h3>
        <p className="text-gray-700">
          Proactively identify potential safety issues before they escalate, enabling faster response times and better coordination during critical situations.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">Improved Experience</h3>
        <p className="text-gray-700">
          Create smoother crowd flow, reduce wait times, and enhance the overall experience for attendees at your events or venues.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">Data-Driven Decisions</h3>
        <p className="text-gray-700">
          Make informed operational decisions based on accurate, real-time data rather than guesswork or delayed information.
        </p>
      </div>

      {/* Feature 4 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">Resource Optimization</h3>
        <p className="text-gray-700">
          Allocate staff and resources more efficiently, reducing operational costs while maintaining or improving service levels.
        </p>
      </div>
    </div>
  </div>
</div>

      </div>
       </div>
  );
};

export default About;