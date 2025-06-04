import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { BiFilter } from 'react-icons/bi';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';

// Mock property data
const MOCK_PROPERTIES = [
  {
    id: '1',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 4,
    availableUnits: 5,
    rating: 4.9
  },
  {
    id: '2',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 3,
    availableUnits: 3,
    rating: 4.2
  },
  {
    id: '3',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    ],
    daysToGo: 3,
    availableUnits: 3,
    rating: 4.7
  },
  {
    id: '4',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 4,
    availableUnits: 4,
    rating: 4.6
  },
  {
    id: '5',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 4,
    availableUnits: 3,
    rating: 4.8
  },
];

// Second row of properties
const MOCK_PROPERTIES_ROW2 = [
  {
    id: '6',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 3,
    availableUnits: 2,
    rating: 4.5
  },
  {
    id: '7',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/3288102/pexels-photo-3288102.png',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 3,
    availableUnits: 3,
    rating: 4.4
  },
  {
    id: '8',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 3,
    availableUnits: 3,
    rating: 4.3
  },
  {
    id: '9',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 4,
    availableUnits: 4,
    rating: 4.4
  },
  {
    id: '10',
    price: '425',
    address: '101 Hooper St, Athens, Gariki, Abuja',
    bedrooms: 3,
    area: 450,
    images: [
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    daysToGo: 3,
    availableUnits: 4,
    rating: 4.5
  },
];

export default function HomePage() {
  const [showMapView, setShowMapView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const allProperties = [...MOCK_PROPERTIES, ...MOCK_PROPERTIES_ROW2];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Search section with filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
              <div className="pl-4 pr-2 text-gray-500">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Where to"
                className="w-full py-3 px-2 outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-white border-l border-gray-300 py-3 px-4 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <BiFilter className="text-gray-600" size={18} />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowMapView(!showMapView)}
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 px-6 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FaMapMarkerAlt className="text-green-700" />
            <span className="font-medium">Map View</span>
          </button>
        </div>
      </div>

      {/* Property listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              {...property} 
              price={Number(property.price)} 
              shortlet={property.id === '1' || property.id === '3' || property.id === '4'} 
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">About Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green-700">How it Works</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Our Story</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green-700">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green-700">Rent Calculator</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Market Trends</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Rental Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green-700">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-center">© {new Date().getFullYear()} Dwellio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
