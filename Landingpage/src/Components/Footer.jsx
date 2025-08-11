import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#111B44] text-white py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-orange-400">Crowd</span>Flow
          </h1>
          <p className="text-sm text-gray-300 opacity-70">
            Delivering real-time insights while maintaining privacy and full GDPR compliance. Trusted by organizations for smart visitor analytics.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-400">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-orange-400">Home</a></li>
            <li><a href="#" className="hover:text-orange-400">Event </a></li>
            <li><a href="#" className="hover:text-orange-400">Service </a></li>
            <li><a href="#" className="hover:text-orange-400">Contact-us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-400">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: info@crowdflow.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Address: 1234 Insight Lane, Smart City</li>
          </ul>
        </div>
         <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-400">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: info@crowdflow.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Address: 1234 Insight Lane, Smart City</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CrowdFlow. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
