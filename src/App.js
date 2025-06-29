import './App.css';
import React, { useState, useEffect } from "react";
import ModalWrapper from './components/modals/ModalWrapper';
import DynamicModalContent from './components/modals/DynamicModalContent';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('site');
  const [articleInfo, setArticleInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [modalType, setModalType] = useState(null);
  const [articleAccessValues, setArticleAccessValues] = useState([0, 1]);
  const [articleAccessValue1, articleAccessValue2] = articleAccessValues;
  const [isMaxArticlesReached, setIsMaxArticlesReached] = useState(false);

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => setModalType(null);

  const adjustArticleAccessValues = (type) => {
    if (type == "+") {
      setArticleAccessValues([articleAccessValue1 + 2, articleAccessValue2 + 2]);
    }
    else if (type == "-") {
      setArticleAccessValues([articleAccessValue1 - 2, articleAccessValue2 - 2]);
    }
    else if (type == "default") {
      setArticleAccessValues([0, 1]);
    }
  }

  const isTopArticlesShown = articleAccessValue1 == 0;

  useEffect(() => {
    setArticleAccessValues([0, 1]);
    setIsMaxArticlesReached(false);
  }, [searchQuery]);

  useEffect(() => {
    setIsMaxArticlesReached(articleAccessValue1 + 2 > articleInfo.length || articleAccessValue2 + 2 > articleInfo.length);
  }, [articleAccessValue1, articleAccessValue2]);

  const fetchData = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`);
      const data = await response.json();

      const searchResults = data.query.search;
      console.log("Search Type: ", searchType);
      console.log("Search Type: ", searchResults);
      console.log("Search Query:", searchQuery);
      const tempArray = [];
      for (const result of searchResults) {
        if (result.title.toLowerCase().includes(query.toLowerCase())) { // To Make Search Articles More Precise
          const contentResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(result.title)}`);
          const contentData = await contentResponse.json();

          console.log("Content Response: ", contentResponse);

          tempArray.push({
            title: result.title,
            summary: contentData.extract,
            pageID: result.pageid
          });
        }
      }
      setArticleInfo(tempArray);
    } catch (error) {
      setError("Failed fetching Wikipedia Content.");
      console.error("Error fetching Wikipedia Content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Full List of Articles: ", articleInfo);
  }, [searchResults])

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="App">
      <div className="Title"><h1>Plan Finder</h1></div>
      <div className="IconsSignIn">
        <button className="signIn" onClick={() => setModalType('signIn')}>Sign In</button>
        <button className="register" onClick={() => setModalType('signUp')}>Sign Up</button>
      </div>
      <div>
        <h2 className="InfoCard1">Search for things to do on your holiday!</h2>
        <p className="InfoCard2">Look for attractions, parks, museums and more... </p>
      </div>
      <form onSubmit={handleSubmit} className="searchBar">
        <input className="searchArea" type="search" placeholder="Enter your city..." onChange={(e) => setQuery(e.target.value)} value={query} />
        <select className="searchSelection" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="site">Attractions</option>
          <option value="museum">Museums</option>
          <option value="park">Parks</option>
          <option value="beach">Beaches</option>
        </select>
        <button className="searchButton" type="submit" disabled={loading} onClick={() => setSearchQuery(`List of ${searchType} in ${query}`)}> {loading ? 'Loading...' : 'Search'} </button>
      </form>
      {articleInfo.length > 1 && (
        <div className="searchLinks">
          {!isTopArticlesShown && (
            <>
              <button className='articleButton top2' onClick={() => adjustArticleAccessValues("default")}>Top</button>
              <button className='articleButton prev' onClick={() => adjustArticleAccessValues("-")}>&lt;</button>
            </>
          )}
          {!isMaxArticlesReached && (
            <button className='articleButton next ' onClick={() => adjustArticleAccessValues("+")}>&gt;</button>
          )}
          <h2>Articles:</h2>
          <h3>Top Articles:</h3>
          {articleInfo[0] && (
            <a
              className={articleAccessValue1 == 0 ? "linkHighlight" : ""} href={`https://en.wikipedia.org/?curid=${articleInfo[0].pageID}`}
              target="_blank" rel="noopener noreferrer">{articleInfo[0].title}
            </a>
          )}
          {articleInfo[1] && (
            <a
              className={articleAccessValue2 == 1 ? "linkHighlight" : ""} href={`https://en.wikipedia.org/?curid=${articleInfo[1].pageID}`}
              target="_blank" rel="noopener noreferrer">{articleInfo[1].title}
            </a>
          )}
          <div><br /></div>
          <h3>Other Articles:</h3>
          {articleInfo.length > 0 ? (
            <ul> {articleInfo.slice(2).map((article, index) => (
              <li key={index}>
                <a
                  className={index + 2 == articleAccessValue1 || index + 2 == articleAccessValue2 ? "linkHighlight" : ""}
                  href={`https://en.wikipedia.org/?curid=${article.pageID}`} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>))}
            </ul>) : (!loading && <p>No other  results found.</p>)}
        </div>
      )}
      {articleInfo.length > 0 && (
        <div className="searchResults">
          {articleInfo[articleAccessValue1] ? (
            <>
              <h2>{articleInfo[articleAccessValue1].title}</h2>
              <p>{articleInfo[articleAccessValue1].summary}</p>
              <button className='readArticleButton'>
                <a href={`https://en.wikipedia.org/?curid=${articleInfo[articleAccessValue1].pageID}`} target="_blank" rel="noopener noreferrer">Read More About This Article</a>
              </button>
            </>
          ) : (
            <><p></p></>
          )}
          {articleInfo[articleAccessValue2] ? (
            <>
              <h2>{articleInfo[articleAccessValue2].title}</h2>
              <p>{articleInfo[articleAccessValue2].summary}</p>
              <button className='readArticleButton'>
                <a href={`https://en.wikipedia.org/?curid=${articleInfo[articleAccessValue2].pageID}`} target="_blank" rel="noopener noreferrer">Read More About This Article</a>
              </button>
            </>
          ) : (
            <><p></p></>
          )}
        </div>
      )}
      {articleInfo < 1 && searchQuery != "" && !loading && (
        <div className="errorMessage">
          <h3>No results found for "{searchQuery.trim().split(" ").at(-1)}". Please enter another city.</h3>
        </div>
      )}
      {modalType && (
        <ModalWrapper onClose={closeModal}>
          <DynamicModalContent type={modalType} />
        </ModalWrapper>
      )}
      {showBanner && (
        <div className="instructions">
          To get started, enter a City in the search bar above then hit Search.
        </div> 
      )}
      <div className='projectDisclaimer'>
        <p>Powered By Wikipedia API</p>
      </div>
    </div>
  );
}

export default App;