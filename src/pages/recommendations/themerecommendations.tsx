import '../../app/styles/globals.css';
import { useState } from 'react';

interface Recommendation {
  data: string;
}

const Recommendations = () => {
  const [query3, setQuery3] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  const fetchRecommendation = async () => {
    const response = await fetch(`/api/chatgpt3?query=${query3}`);
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
          value={query3}
          onChange={(event) => setQuery3(event.target.value)}
        />
        <button type="submit">Get Recommendation</button>
      </form>
      {recommendation && (
        <div className="text-red-500">
          <p>{'recommendation for themes'}</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
