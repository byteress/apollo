import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-gray-800 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-start">
              <img 
                src="https://storage.googleapis.com/aida-uploads/default/2026-03-17/1625.png" 
                alt="1625 Autolab Logo" 
                className="h-12 md:h-16 w-auto max-w-[200px] md:max-w-[300px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              The premier automotive retrofitting and custom fabrication shop in Los Angeles. We turn ordinary vehicles into extraordinary machines.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-brand-gray flex items-center justify-center rounded-sm hover:bg-brand-orange hover:text-white transition-colors text-gray-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-brand-gray flex items-center justify-center rounded-sm hover:bg-brand-orange hover:text-white transition-colors text-gray-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-brand-gray flex items-center justify-center rounded-sm hover:bg-brand-orange hover:text-white transition-colors text-gray-400">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display uppercase tracking-wider text-xl mb-6 border-b border-gray-800 pb-4">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Services</a></li>
              <li><a href="#builds" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Recent Builds</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Book Appointment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-display uppercase tracking-wider text-xl mb-6 border-b border-gray-800 pb-4">
              Our Services
            </h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Headlight Retrofits</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Android Headunits</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Performance Tuning</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Custom Fabrication</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span> Security Systems</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-display uppercase tracking-wider text-xl mb-6 border-b border-gray-800 pb-4">
              Contact Us
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                <span className="text-gray-400">NKKS Arcade, Krystal Homes, Brgy. Alasas<br />Pampanga, San Fernando, Philippines, 2000</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-gray-400">0939 330 8263</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-gray-400">1625autolab@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 1625 Autolab. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
