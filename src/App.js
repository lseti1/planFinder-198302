import './App.css';

function App() {
  return (
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
      <input type="search" className="SearchArea" placeholder="Search for Plan..."></input>
    </div>
    <div className="sortButton">Sort By:</div>
    <div className="filterButtons">Filters Section</div>
    <div className="searchResults">Search Results - This section will need to update to allow scrolling to the bottom tho</div>
    </div>
  );
}

export default App;
