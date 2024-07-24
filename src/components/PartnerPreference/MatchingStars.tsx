// import React, { useState, useEffect } from 'react';
import Checkbox from './CheckBox';

interface MatchingStarsProps {
  initialPoruthas: string;
  starAndRasi: { id: string; star: string; rasi: string }[];
  selectedStarIds: string[]; // Add this prop to maintain selected state
  onCheckboxChange: (updatedIds: string[]) => void; // Callback function
}

const MatchingStars: React.FC<MatchingStarsProps> = ({ initialPoruthas, starAndRasi, selectedStarIds, onCheckboxChange }) => {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    const updatedIds = checked 
      ? [...selectedStarIds, id] 
      : selectedStarIds.filter(itemId => itemId !== id);
    
    onCheckboxChange(updatedIds); // Call the callback function with updated IDs
  };

  return (
    <div>
      <div className="mb-5">
        <h5 className="text-[18px] text-black font-semibold mb-2">
          {initialPoruthas}
        </h5>
        <div className="grid grid-cols-5 grid-rows-1 justify-between items-center gap-x-3 gap-y-2">
          {starAndRasi.map((item, index) => (
            <div key={item.id}>
              <Checkbox
                id={item.id}
                name={`star-${index}`}
                value={`${item.star} - ${item.rasi}`}
                label={`${item.star} - ${item.rasi}`}
                checked={selectedStarIds.includes(item.id)} // Set checked state based on selectedStarIds
                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingStars;
