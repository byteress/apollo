import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  { 
    id: 'p1',
    name: 'RGB Demon Eyes Kit', 
    price: 149.99, 
    category: 'Lighting',
    img: 'https://images.unsplash.com/photo-1584345611124-287a5085e648?q=80&w=2015&auto=format&fit=crop' 
  },
  { 
    id: 'p2',
    name: '10.1" Android Headunit', 
    price: 499.99, 
    category: 'Electronics',
    img: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?q=80&w=1974&auto=format&fit=crop' 
  },
  { 
    id: 'p3',
    name: 'Sequential LED Halos', 
    price: 199.99, 
    category: 'Lighting',
    img: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop' 
  },
  { 
    id: 'p4',
    name: 'Performance ECU Tune', 
    price: 599.99, 
    category: 'Performance',
    img: 'https://images.unsplash.com/photo-1503375815615-58532f627725?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 'p5',
    name: 'Custom Switch Panel', 
    price: 89.99, 
    category: 'Interior',
    img: 'https://images.unsplash.com/photo-1632823471565-1ec2a74b45b4?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 'p6',
    name: '2-Way Paging Alarm', 
    price: 299.99, 
    category: 'Security',
    img: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?q=80&w=2070&auto=format&fit=crop' 
  },
];

const categories = ['All', 'Lighting', 'Electronics', 'Performance', 'Interior', 'Security'];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-orange font-bold uppercase tracking-widest text-sm">
            Shop Parts
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter">
            Product <span className="text-brand-orange">Catalog</span>
          </h1>
          <div className="w-24 h-1 bg-brand-orange mx-auto mt-6"></div>
          <p className="text-gray-400 mt-6 text-lg">
            High-quality components and kits tested and approved by The Lab.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-brand-orange mr-2" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors border ${
                  activeCategory === category 
                    ? 'bg-brand-orange text-white border-brand-orange' 
                    : 'bg-transparent text-gray-400 border-gray-800 hover:border-brand-orange hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-dark border border-gray-800 text-white px-4 py-3 pl-10 focus:outline-none focus:border-brand-orange transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link 
              to={`/products/${product.id}`}
              key={product.id} 
              className="bg-brand-dark border border-gray-800 rounded-sm overflow-hidden group hover:border-brand-orange/50 transition-colors duration-300 flex flex-col"
            >
              <div className="aspect-square bg-asphalt overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold uppercase tracking-widest px-3 py-1 z-10">
                  {product.category}
                </div>
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-white font-bold uppercase tracking-wider mb-2 text-lg line-clamp-2">{product.name}</h3>
                <p className="text-brand-orange font-display text-2xl font-bold mt-auto">
                  ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 text-brand-orange hover:text-white transition-colors underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
