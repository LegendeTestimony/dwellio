import { useState } from 'react';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaStar } from 'react-icons/fa';
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from 'react-icons/io';

interface PropertyCardProps {
  id: string;
  images: string[];
  price: number;
  address: string;
  bedrooms: number;
  shortlet: boolean;
  area: number;
  rating: number;
  daysToGo: number;
  availableUnits: number;
}

export default function PropertyCard({ 
  id, 
  images, 
  price, 
  address, 
  bedrooms, 
  shortlet, 
  area,
  rating,
  daysToGo,
  availableUnits
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const toggleSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div className="group/card relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
      {/* Image gallery with navigation */}
      <div className="relative h-[240px] w-full overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={`Property ${id}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
        />
        
        {/* Days to go and available units badges */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-sm">
          {daysToGo} days to go
        </div>
        
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-sm">
          {availableUnits} Available Units
        </div>
        
        {/* Image navigation controls - visible on hover */}
        <button 
          onClick={prevImage} 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-gray-100 shadow-md hover:scale-105 "
          aria-label="Previous image"
        >
          <IoMdArrowRoundBack className="text-gray-700 text-lg" />
        </button>
        
        <button 
          onClick={nextImage} 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-gray-100 shadow-md hover:scale-105"
          aria-label="Next image"
        >
          <IoMdArrowRoundForward className="text-gray-700 text-lg" />
        </button>
        
        {/* Action buttons */}
        <div className="absolute bottom-3 left-3 flex space-x-2">
          <button 
            onClick={toggleFavorite} 
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? 
              <FaHeart className="text-red-500" /> : 
              <FaRegHeart className="text-gray-700" />
            }
          </button>
          
          <button 
            onClick={toggleSaved} 
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
            aria-label={isSaved ? "Remove from saved" : "Save property"}
          >
            {isSaved ? 
              <FaBookmark className="text-green-700" /> : 
              <FaRegBookmark className="text-gray-700" />
            }
          </button>
        </div>
        
        {/* Apply now button, visible on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button className="bg-green-700 hover:bg-green-800 text-white py-1.5 px-4 rounded-full text-sm font-medium transition-all hover:shadow-lg transform hover:scale-105">
            Apply Now
          </button>
        </div>
      </div>
      
      {/* Property details */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">${price}</div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-700 font-medium mt-2 truncate">{address}</p>
        
        <div className="flex items-center mt-2 text-gray-600 text-sm space-x-4">
          <div className="flex items-center">
            <span className="font-medium">{bedrooms} Bedroom</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{shortlet ? 'Shortlet' : 'Longterm'}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{area} m²</span>
          </div>
        </div>

        {/* Bottom action bar with pagination dots */}
        <div className="flex justify-center mt-4 space-x-1 overflow-hidden">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'w-6 bg-green-700' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
