import './App.css';
import React, {useState} from "react";

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('touristAttractions'); 

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
      console.log("City = ", city);
      if (searchType === 'touristAttractions') {
        searchQuery += 'tourist attractions ';
      } else if (searchType === 'museums') {
        searchQuery += 'museum ';
      } else if (searchType === 'parks') {
        searchQuery += 'parks ';
      } else if (searchType === 'monuments') {
        searchQuery += 'monuments ';
      } 
      
      searchQuery += "in " + city; // To Specify Search
      console.log("Full Search: ", searchQuery);

      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchQuery}&origin=*`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.query || !data.query.search) {
        setResults([]);
        setFirstPageContent('');
        return;
      }

      const searchResults = data.query.search;
      setResults(searchResults);

      if (searchResults.length > 0) {
        const firstPageId = searchResults[0].pageid;
        const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=false&explaintext=false&pageids=${firstPageId}&origin=*`;
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const firstPageExtract = contentData.query.pages[firstPageId].extract;
        setFirstPageContent(firstPageExtract);
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
          <option value="touristAttractions">Tourist Attractions</option>
          <option value="museums">Museums</option>
          <option value="parks">Parks & Gardens</option>
          <option value="monuments">Monuments</option>
        </select>
        <button type="submit" disabled={loading}> {loading ? 'Searching...' : 'Search'} </button>
      </div>
      <div className="filterButtons">
        {results.length > 0 ? (
            <ul> {results.map((result) => (
              <li key={result.pageid}>
                <a href={`https://en.wikipedia.org/?curid=${result.pageid}`} target="_blank" rel="noopener noreferrer">{result.title}</a>
                {/* <p dangerouslySetInnerHTML={{ __html: result.snippet }} /> */}
              </li> ))}
            </ul>
          ) : (
            !loading && <p>No results were found.</p>
          )}
      </div>
      <div className="searchResults">
        {firstPageContent && (
          <div>
            <h2>Content from the First Page Link:</h2>
            <div dangerouslySetInnerHTML={{ __html: firstPageContent }} />
          </div>
        )}
      </div>
    </div>
    </form>
  );
}

export default App;
