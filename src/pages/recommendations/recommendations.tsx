import '../../app/styles/globals.css';
import { useState } from 'react';

interface Recommendation {
  data: string;
}

const Recommendations = () => {
  const [query, setQuery] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  const fetchRecommendation = async () => {
    const response = await fetch(`/api/recommendations?query=${query}`);
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
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Get Recommendation</button>
      </form>
      {recommendation && (
        <div className="text-red-500">
          <p>{'recommendation for events'}</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
