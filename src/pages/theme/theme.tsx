import Navbar from '@/components/navbar/navbar';
import '../../app/styles/globals.css';
import Searchbar from '@/components/searchbar/searchbar';
import Posts from '@/app/posts/page';

const Theme = () => {
  const handleSearch = (searchTerm: string) => {
    console.log(searchTerm);
  };
  return (
    <div className="border-solid border-2 border-red-500 h-screen w-full p-1">
      <Navbar title={'Themes'} />
      {/* now first comes the search bar for searching all the themes available in the db or all premade themes which will we rendered in scrollable card tray with no maximum width while fixed height*/}
      <div className="border-solid border-2 border-orange-600 rounded-lg overflow-clip mx-4 my-2 text-green-500">
        <Searchbar onSearch={handleSearch} />
      </div>
      <div className="border-solid border-2 border-yellow-600 rounded-sm">
        Themes
        <Posts />
      </div>
      {/* Later will come create a theme btn which will lead to create theme page based on keyword passed as it asks for a key when clicking create new theme like hackathon the params it will ask will be duration keyword to describe your theme and number of people expected to attend */}
    </div>
  );
};

export default Theme;
