import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, MonitorPlay, Wrench, ShieldAlert, Zap, CarFront } from 'lucide-react';
import type { ServiceItem } from '../types';

export const services: ServiceItem[] = [
  {
    id: '1',
    title: 'Headlight Retrofits',
    description: 'Custom projector retrofits, demon eyes, halos, and sequential turn signals for maximum visibility and aggressive styling.',
    icon: 'Lightbulb',
  },
  {
    id: '2',
    title: 'Android Headunits',
    description: 'Modernize your dash with high-resolution Android screens featuring Apple CarPlay, Android Auto, and custom bezels.',
    icon: 'MonitorPlay',
  },
  {
    id: '3',
    title: 'Performance Tuning',
    description: 'ECU remaps and piggyback systems to unlock hidden horsepower and torque safely.',
    icon: 'Zap',
  },
  {
    id: '4',
    title: 'Custom Fabrication',
    description: 'Bespoke mounts, brackets, and enclosures designed and 3D printed in-house for a factory-finish look.',
    icon: 'Wrench',
  },
  {
    id: '5',
    title: 'Security Systems',
    description: 'Advanced alarm systems, GPS tracking, and kill switches to protect your investment.',
    icon: 'ShieldAlert',
  },
  {
    id: '6',
    title: 'Aesthetic Upgrades',
    description: 'Grille swaps, ambient lighting, and interior trim wrapping to personalize your ride.',
    icon: 'CarFront',
  },
];

const IconMap: Record<string, React.ElementType> = {
  Lightbulb,
  MonitorPlay,
  Zap,
  Wrench,
  ShieldAlert,
  CarFront,
};

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 bg-asphalt relative overflow-hidden border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-orange font-bold uppercase tracking-widest text-sm">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
            The <span className="text-brand-orange">Lab</span> Services
          </h2>
          <div className="w-24 h-1 bg-brand-orange mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = IconMap[service.icon];
            return (
              <Link
                to={`/services/${service.id}`}
                key={service.id}
                className="group relative bg-brand-darker/80 backdrop-blur-sm border border-gray-800 p-8 transition-all duration-300 hover:scale-[1.02] hover:border-brand-orange hover:bg-brand-dark hover:shadow-[0_0_20px_rgba(243,111,33,0.4)]"
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-transparent group-hover:border-brand-orange transition-colors duration-300"></div>
                
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-brand-dark border border-gray-700 rounded-sm group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors duration-300 group-hover:shadow-[0_0_15px_rgba(243,111,33,0.6)]">
                  <Icon className="w-8 h-8 text-brand-orange group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-wide group-hover:text-brand-orange transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors duration-300">
                  <span>Learn More</span>
                  <div className="w-8 h-[1px] bg-gray-500 group-hover:bg-brand-orange group-hover:w-12 transition-all duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
