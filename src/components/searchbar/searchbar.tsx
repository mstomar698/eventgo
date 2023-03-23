'use client';
import { useState } from 'react';
import axios from 'axios';
import { RiSearchLine } from 'react-icons/ri';

interface Props {
  onSearch: (searchTerm: string) => void;
}

const Searchbar: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post('/api/searchedtheme', { searchTerm });
      onSearch(searchTerm);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center rounded-md bg-gray-800 px-3 py-2">
        <input
          type="text"
          placeholder="Search themes"
          className="bg-gray-800 text-green-400 focus:outline-none flex-1"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          title="search-btn"
          type="submit"
          className="flex items-center ml-2 mb-0.5"
        >
          search
          <RiSearchLine className="text-gray-400 ml-1" />
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
