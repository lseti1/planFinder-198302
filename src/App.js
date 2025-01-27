import './App.css';
import React, {useState} from "react";

function App() {
  const [userSearch, setUserSearch] = useState("");

  const handleInput = (event) => {
    const value = event.target.value;
    setUserSearch(value);
  };

  const handleSearch = (event) => {
    event.preventDefault(); // This stops the page from reloading
    console.log("Searched Plan: ", userSearch);
  };

  return (
    <form onSubmit={handleSearch}>
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
      <input type="search" className="SearchArea" placeholder="Search for Plan..." onChange = {handleInput} value = {userSearch}></input>
    </div>
    <div className="sortButton">Sort By:</div>
    <div className="filterButtons">Filters Section</div>
    <div className="searchResults">Search Results - This section will need to update to allow scrolling to the bottom tho</div>
    </div>
    </form>
  );
}

export default App;
