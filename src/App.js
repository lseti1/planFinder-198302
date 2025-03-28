import './App.css';
import React, {useState} from "react";

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('museums'); 

  const [summary, setSummary] = useState('');
  const [city, setCity] =  useState('');

  const fetchData = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // To ensure that the search title is understandable and works with the on screen selector
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
      searchQuery += "in " + city;
      console.log("Full Search: ", searchQuery);

      // To get the list of articles and set up displays
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`);
      const data = await response.json();
      if (!data.query || !data.query.search) {
        setResults([]);
        setSummary('');
        return;
      }

      // To Make Search Articles More Precise
      const searchResults = data.query.search;
      const filteredResults = searchResults.filter(result =>
        result.title.toLowerCase().includes(city.toLowerCase())
      );
      console.log(filteredResults.length);
      setResults(filteredResults);

      // To Get and display Content from the First Article Found
      if (searchResults.length > 0) {
        const firstPageTitle = searchResults[0].title;
        console.log("Title = ", firstPageTitle);
        try {
          const contentResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstPageTitle)}`);
          const contentData = await contentResponse.json();
          setSummary(contentData.extract);
        } catch (error) {
          console.error("Error fetching Wikipedia Content:", error);
          setSummary("Failed fetching Wikipedia Content.");
        }
      }
    } catch (error) {
      setError("Failed fetching Wikipedia Content.");
      console.error("Error fetching Wikipedia Content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // to stop page from reloading
    fetchData(); 
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="App">
      <div className="Title"><h2>Plan Finder</h2></div>
      <div className="IconsSignIn">
        <button className="signIn">Sign In</button>
        <button className="register">Register</button>
      </div>
      <div >
        <h1 className="InfoCard1">Search for things to do on your holiday!</h1>
        <p className="InfoCard2">Look for attractions, parks, museums and more... </p>
      </div>
      <div className="searchBar">
        <input className="searchArea" type="search" placeholder="Enter your city..." onChange={(e) => setQuery(e.target.value)} value={query}/>
        <select className="searchSelection" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="Attractions">Tourist Attractions</option>
          <option value="museums">Museums</option>
          <option value="parks">Parks & Gardens</option>
          <option value="monuments">Monuments</option>
          <option value="beaches">Beaches</option>
        </select>
        <button className="searchButton" type="submit" disabled={loading}> {loading ? 'Searching...' : 'Search'} </button>
      </div>
      {summary && (
        <div className="searchLinks">
          <h2>Other Articles:</h2>
          {results.length > 0 ? (
              <ul> {results.slice(1).map((result) => (
                <li key={result.pageid}>
                  <a href={`https://en.wikipedia.org/?curid=${result.pageid}`} target="_blank" rel="noopener noreferrer">{result.title}</a>
                </li> ))}
              </ul> ) : (!loading && <p>No other  results found.</p>)}
        </div>
      )}
      {summary ? (
        <div className="searchResults">
          <div>
            <h2>{results[0].title}</h2>
            <p>{summary}</p>
            <a href={`https://en.wikipedia.org/?curid=${results[0].pageid}`} target="_blank" rel="noopener noreferrer">Read More About This Article</a>
          </div>
        </div>
      ) : (
        <div className="instructions">
          <h2>To get started, enter the city you're at into the search bar above, select what you're looking for specifically and then hit search!</h2>  
        </div>
      )} 
      <div className='bottomText'>
        <p>Powered By Wikipedia API <br />(This website is best viewed in Full Screen)</p>
      </div>

    </div>
    </form>
  );
}

export default App;
