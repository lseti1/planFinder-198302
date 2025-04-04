import './App.css';
import React, {useState, useEffect} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('museums'); 

  const [summary, setSummary] = useState('');
  const [city, setCity] =  useState('');
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const switchSignInUpModals = () => {
    setIsSignInModalVisible(prevState => !prevState);
    setIsSignUpModalVisible(prevState => !prevState);
  };

  const removeModals = () => {
    setIsSignInModalVisible(false);
    setIsSignUpModalVisible(false);
  };

  useEffect(() => {
    if (isSignInModalVisible || isSignUpModalVisible) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [isSignInModalVisible, isSignUpModalVisible]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="App">
        <div className="Title"><h1>Plan Finder</h1></div>
        <div className="IconsSignIn">
          <button className="signIn" onClick={() => setIsSignInModalVisible(true)}><FontAwesomeIcon icon={faUser}/> Sign In</button>
          <button className="register" onClick={() => setIsSignUpModalVisible(true)}><FontAwesomeIcon icon={faUserPlus}/> Sign Up</button>
        </div>
        <div >
          <h2 className="InfoCard1">Search for things to do on your holiday!</h2>
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
              <h2>{results[0].title}</h2>
              <p>{summary}</p>
              <a href={`https://en.wikipedia.org/?curid=${results[0].pageid}`} target="_blank" rel="noopener noreferrer">Read More About This Article</a>
          </div>
        ) : (
          <div className="instructions">
            <h3>To Get Started: Enter the city you're at above, select what type of destination you're looking for and then hit search!</h3>  
          </div>
        )} 
        

        {isSignInModalVisible && (
          <div className='modal'>
            <h1>Log In</h1>
            <input className= 'modalTextInputs' type='text' placeholder='Email Address'/>
            <input className= 'modalTextInputs' type='text' placeholder='Password'/>
            <p>Forgot Password?</p>
            <button className='modalSubmitButton' type='submit' onClick={() => setIsSignInModalVisible(false)}>Sign In</button>
            <button className='modalExitButton' onClick={() => setIsSignInModalVisible(false)}>X</button>
            <button className='linkedButton' onClick={() => setIsSignInModalVisible(false)}>Can't Access Account?</button>
            <p>Don't have an account?
              <button className="linkedButton" onClick={switchSignInUpModals}>
                Sign Up Here
              </button>
            </p>
            <p className='disclaimer'>Please Note: For visual purposes, Sign In capabilities are off.</p>
          </div>
        )}

        {isSignUpModalVisible && (
          <div className='modal'>
            <h1>Set Up Your Account</h1>
            <input className= 'modalTextInputs' type='text' placeholder='Email Address'/>
            <input className= 'modalTextInputs' type='text' placeholder='Password'/>
            <input className= 'modalTextInputs' type='text' placeholder='Confirm Password'/>
            <button className='modalSubmitButton' type='submit' onClick={() => setIsSignUpModalVisible(false)}>Sign Up</button>
            <button className='modalExitButton' onClick={() => setIsSignUpModalVisible(false)}>X</button>
            <p>Already have an account?
              <button className="linkedButton" onClick={switchSignInUpModals}>
                Log In Here
              </button>
            </p>
            <p className='disclaimer'>Please Note: For visual purposes, Sign Up capabilities are off.</p>
          </div>
        )}

        {isModalVisible && (
          <div className='modalBackground' onClick={() => removeModals()}></div>
        )}

      </div>
      <div className='projectDisclaimer'>
          <p>Powered By Wikipedia API <br />(This website is best viewed in Full Screen)</p>
      </div>
    </form>
  );
}

export default App;
