import './App.css';
import React, {useState} from "react";

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('Attractions'); 
  const [summary, setSummary] = useState('');

  const [city, setCity] =  useState('');

  const fetchData = async () => {
    if (!query.trim()) {
      // If the query is empty, clear the results and return
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Just to make the search more speicific
      let searchQuery = "List of ";
      let city = query;
      setCity(city);
      if (searchType === 'Attractions') {
        searchQuery += 'attractions ';
      } else if (searchType === 'museums') {
        searchQuery += 'museum ';
      } else if (searchType === 'parks') {
        searchQuery += 'parks ';
      } else if (searchType === 'monuments') {
        searchQuery += 'monuments ';
      } else if (searchType === 'beaches') {
        searchQuery += 'beaches ';
      } 
      
      searchQuery += "in " + city; // To Specify Search
      console.log("Full Search: ", searchQuery);

      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`);
      const data = await response.json();

      if (!data.query || !data.query.search) {
        setResults([]);
        setSummary('');
        return;
      }

      // Updated Search Logic Here To Prevent Unwanted Search Pages
      const searchResults = data.query.search;
      const filteredResults = searchResults.filter(result => 
        result.title.toLowerCase().includes(city.toLowerCase())
        // && result.title.toLowerCase().includes(searchType.toLowerCase()) // Don't know about this line, may take it out for the purposes of having content on screen
      );
      console.log(filteredResults.length);
      setResults(filteredResults);

      // Fetch content of the first page
      if (searchResults.length > 0) {
        const firstPageTitle = searchResults[0].title;
        console.log("Title = ", firstPageTitle);
        try {
          const contentResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstPageTitle)}`);
          const contentData = await contentResponse.json();
          setSummary(contentData.extract);
        } catch (error) {
          console.error("Error fetching Wikipedia summary:", error);
          setSummary("Failed to fetch summary.");
        }
      } 
    } catch (error) {
      setError('Failed to fetch data from Wikipedia.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // just stops page from reloading
    fetchData(); // 
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="App">
      <div className="Title"><h2>Plan Finder</h2></div>
      <div className="IconsSignIn">
        <button className="buttons">Sign In</button>
        <button className="buttons">Register</button>
      </div>
      <div >
        <h1 className="InfoCard1">Search for things to do on your holiday!</h1>
        <p className="InfoCard2">Look for attractions, parks, museums and more... </p>
      </div>
      <div className="SearchBar">
        <input type="search" className="SearchArea" placeholder="Enter your city..." onChange={(e) => setQuery(e.target.value)} value={query}/>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="Attractions">Tourist Attractions</option>
          <option value="museums">Museums</option>
          <option value="parks">Parks & Gardens</option>
          <option value="monuments">Monuments</option>
          <option value="beaches">Beaches</option>
        </select>
        <button type="submit" disabled={loading}> {loading ? 'Searching...' : 'Search'} </button>
      </div>
      <div className="searchLinks">
        <h2>Articles Found:</h2>
        {results.length > 0 ? (
            <ul> {results.map((result) => (
              <li key={result.pageid}>
                <a href={`https://en.wikipedia.org/?curid=${result.pageid}`} target="_blank" rel="noopener noreferrer">{result.title}</a>
              </li> ))}
            </ul>
          ) : (
            !loading && <p>No results were found.</p>
          )}
      </div>
      <div className="searchResults">
      {summary && (
        <div>
          <h2>About the {searchType} in {city}</h2>
          <p>{summary}</p>
        </div>
      )}
      </div>
    </div>
    </form>
  );
}

export default App;
