import '../../app/styles/globals.css';
import { useState } from 'react';

interface Recommendation {
  data: string;
}

const Recommendations = () => {
  const [query1, setQuery1] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  const fetchRecommendation = async () => {
    const response = await fetch(`/api/chatgpt?query=${query1}`);
    const data = await response.json();
    console.log('data from element' + data);
    setRecommendation(data);
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
      {recommendation && (
        <div className="text-red-500">
          <p>{'info for word'}</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
