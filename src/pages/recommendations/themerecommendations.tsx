import '../../app/styles/globals.css';
import { useState } from 'react';

const Recommendations = () => {
  const [query, setQuery] = useState('');
  const [recommendation, setRecommendation] = useState<any | null>(null);

  const fetchRecommendation = async () => {
    const response = await fetch(`/api/chatgpt3?query=${query}`);
    const data = await response.json();
    console.log('query from theme recommendation page is \n' + query);
    const dataString = JSON.stringify(data);
    const recommedationData = JSON.parse(dataString);
    console.log('whole response is in string format' + dataString);
    setRecommendation(recommedationData);
    console.log('query response is ' + recommedationData.recommendation);
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
        <button type="submit">Get Themes</button>
      </form>
      {recommendation && (
        <div className="text-red-500 bg-green-400">
          <h1>Theme Recommendation Page</h1>
          <p>{`string data from object ${recommendation.recommendation}`}</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
