import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const builds = [
  {
    id: 1,
    title: 'Honda BR-V 2017 Full Setup',
    description: 'Equipped with X1 Bi-LED Projector Headlights and Tri-Color Foglights. Both with 6-8 years lifespan & 3 Years Warranty.',
    features: [
      '6000K Super White Light Output',
      'Low & High Beam Functions',
      'Super White / Yellowish / Super Yellow Foglights',
      '40 Watts Output, 25,000 LUX',
      '100% Waterproof'
    ],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
    tags: ['#1625autolab', '#honda', '#hondabrv', '#headlights', '#retrofit']
  },
  {
    id: 2,
    title: 'HONDA CIVIC FD 2010',
    description: 'Now equipped with X1 Bi-LED Projector Headlights with FREE Amber Demon Eyes installed 🔥',
    features: [
      '6000K Super White Light Output',
      'High & Low Beam Function',
      '3 Years Warranty',
      'Amber Demon Eyes'
    ],
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80',
    tags: ['#1625autolab', '#honda', '#hondacivicfd', '#hondacivicfd2010', '#headlightsretorifit', '#hondaclubph']
  }
];

export default function Portfolio() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-brand-orange font-bold uppercase tracking-widest text-sm block mb-2">
            Recent Builds
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter mb-6">
            Our <span className="text-brand-orange">Portfolio</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Check out some of our recent installations and upgrades. Does your car also need a Full Setup?
          </p>
        </div>

        <div className="space-y-16">
          {builds.map((build, index) => (
            <div key={build.id} className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gray-800 group">
                  <div className="absolute inset-0 bg-brand-orange/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={build.image} 
                    alt={build.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wide mb-4">
                  {build.title}
                </h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  {build.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4">Equipped With:</h3>
                  <ul className="space-y-2">
                    {build.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-brand-orange mt-1">✔</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {build.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-bold text-gray-500 bg-brand-dark px-2 py-1 rounded-sm border border-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto p-6 bg-brand-dark border border-gray-800 rounded-sm">
                  <h4 className="text-white font-bold mb-2">Planning to upgrade your vehicle?</h4>
                  <p className="text-gray-400 text-sm mb-4">Message us today to schedule your installation.</p>
                  <Link 
                    to="/booking"
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-colors w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4" />
                    Book This Setup
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
