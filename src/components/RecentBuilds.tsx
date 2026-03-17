import type { BuildItem } from '../types';
import { Eye } from 'lucide-react';

const builds: BuildItem[] = [
  {
    id: '1',
    title: 'Subaru WRX STI',
    category: 'Quad Projector Retrofit',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Ford Mustang GT',
    category: 'RGB Demon Eyes & Halos',
    imageUrl: 'https://images.unsplash.com/photo-1584345611124-287a5085e648?q=80&w=2015&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Toyota Tacoma TRD',
    category: 'LED Light Bar Integration',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Honda Civic Type R',
    category: 'Sequential Turn Signals',
    imageUrl: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Jeep Wrangler Rubicon',
    category: 'Android Headunit Install',
    imageUrl: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Nissan GTR R35',
    category: 'Custom Taillight Mod',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop',
  },
];

export default function RecentBuilds() {
  return (
    <section id="builds" className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-brand-orange font-bold uppercase tracking-widest text-sm">
              Our Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">
              Recent <span className="text-brand-orange">Builds</span>
            </h2>
            <div className="w-24 h-1 bg-brand-orange mt-6"></div>
          </div>
          
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-white font-display uppercase tracking-wider text-sm hover:text-brand-orange transition-colors"
          >
            View All Projects
            <div className="w-8 h-[1px] bg-white group-hover:bg-brand-orange transition-colors"></div>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build) => (
            <div
              key={build.id}
              className="group relative overflow-hidden rounded-sm bg-brand-gray aspect-[4/3] cursor-pointer"
            >
              <img
                src={build.imageUrl}
                alt={build.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                
                {/* View Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 delay-100 shadow-[0_0_30px_rgba(255,106,0,0.5)]">
                  <Eye className="w-6 h-6 text-white" />
                </div>

                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2 block">
                    {build.category}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                    {build.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
