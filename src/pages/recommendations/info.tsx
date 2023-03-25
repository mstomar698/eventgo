import '../../app/styles/globals.css';
import { useState } from 'react';

interface Recommendation {
  data: string;
}

const Recommendations = () => {
  const [query1, setQuery1] = useState('');
  const [info, setInfo] = useState<any | null>(null);

  const fetchRecommendation = async () => {
    const response = await fetch(`/api/chatgpt?query=${query1}`);
    const data = await response.json();
    console.log('query from recommendation page is \n' + query1);
    const dataString = JSON.stringify(data);
    const infoData = JSON.parse(dataString);
    console.log('whole response is in string format' + dataString);
    setInfo(infoData);
    console.log('query response is ' + infoData.info);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchRecommendation();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          title="Query"
          type="text"
          className="text-green-500"
          value={query1}
          onChange={(event) => setQuery1(event.target.value)}
        />
        <button type="submit">Get Info</button>
      </form>
      {info && (
        <div className="text-red-500 bg-green-400">
          <h1>Recommendation Page</h1>
          <p>{`string data from object ${info.info}`}</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
