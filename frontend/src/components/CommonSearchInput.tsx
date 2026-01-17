import React from 'react';
import { Input } from './ui/Input';
import { COLOR_LIGHT_GRAY } from '@/constants/constants';
import { Search } from 'lucide-react';

const CommonSearchInput = () => {
  return (
    <>
      <div
        className="relative sm:w-auto"
        style={{ width: '335px', height: '44px' }}
      >
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
        <Input
          placeholder="Search by Property Name"
          className="border-gray-200 bg-white sm:w-64 font-normal"
          style={{
            color: COLOR_LIGHT_GRAY,
            width: '335px',
            height: '44px',
            fontSize: '17px',
          }}
        />
      </div>
    </>
  );
};

export default CommonSearchInput;
