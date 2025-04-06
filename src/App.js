import './App.css';
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ModalWrapper from './components/modals/ModalWrapper';
import DynamicModalContent from './components/modals/DynamicModalContent';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('museums');

  const [summary, setSummary] = useState('');
  const [summary2, setSummary2] = useState('');
  const [city, setCity] = useState('');
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  const closeModal = () => setModalType(null);

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
      // if (!data.query || !data.query.search) {
      //   setResults([]);
      //   setSummary('');
      //   return;
      // }

      // To Make Search Articles More Precise
      const searchResults = data.query.search;
      const filteredResults = searchResults.filter(result =>
        result.title.toLowerCase().includes(city.toLowerCase())
      );
      console.log(filteredResults.length);
      setResults(filteredResults);

      // To Get and display Content from the First Article Found
      if (searchResults.length > 1) {
        const firstPageTitle = searchResults[0].title;
        const secondPageTitle = searchResults[1].title;
        console.log("Title = ", firstPageTitle);
        try {
          const contentResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstPageTitle)}`);
          const contentData = await contentResponse.json();
          setSummary(contentData.extract);
          const contentResponse2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(secondPageTitle)}`);
          const contentData2 = await contentResponse2.json();
          setSummary2(contentData2.extract);
        } catch (error) {
          console.error("Error fetching Wikipedia Content:", error);
          setSummary("Failed fetching Wikipedia Content.");
          setSummary2("Failed fetching Wikipedia Content.");
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
          <button className="signIn" onClick={() => setModalType('signIn')}><FontAwesomeIcon icon={faUser} /> Sign In</button>
          <button className="register" onClick={() => setModalType('signUp')}><FontAwesomeIcon icon={faUserPlus} /> Sign Up</button>
        </div>
        <div >
          <h2 className="InfoCard1">Search for things to do on your holiday!</h2>
          <p className="InfoCard2">Look for attractions, parks, museums and more... </p>
        </div>
        <div className="searchBar">
          <input className="searchArea" type="search" placeholder="Enter your city..." onChange={(e) => setQuery(e.target.value)} value={query} />
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
              <ul> {results.slice(2).map((result) => (
                <li key={result.pageid}>
                  <a href={`https://en.wikipedia.org/?curid=${result.pageid}`} target="_blank" rel="noopener noreferrer">{result.title}</a>
                </li>))}
              </ul>) : (!loading && <p>No other  results found.</p>)}
          </div>
        )}
        {summary ? (
          <div className="searchResults">
            <h2>{results[0].title}</h2>
            <p>{summary}</p>
            <button className='readArticleButton'>
              <a href={`https://en.wikipedia.org/?curid=${results[0].pageid}`} target="_blank" rel="noopener noreferrer">Read More About This Article</a>
            </button>

            <h2>{results[1].title}</h2>
            <p>{summary2}</p>
            <button className='readArticleButton'>
              <a href={`https://en.wikipedia.org/?curid=${results[1].pageid}`} target="_blank" rel="noopener noreferrer">Read More About This Article</a>
            </button>
          </div>
        ) : (
          <div className="instructions">
            <h3>To Get Started: Enter the city you're at above, select what type of destination you're looking for and then hit search!</h3>
          </div>
        )}
        {modalType && (
            <ModalWrapper onClose={closeModal}>
              <DynamicModalContent type={modalType}/>
            </ModalWrapper>
        )}

      </div>
      <div className='projectDisclaimer'>
        <p>Powered By Wikipedia API <br />(This website is best viewed in Full Screen)</p>
      </div>
    </form>
  );
}

export default App;