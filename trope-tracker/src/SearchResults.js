import React, { useState, useEffect } from 'react';
import "./SearchResults.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';

const SearchResults = (props) => {
    const [searchQuery, setSearchQuery] = useState(props.location.pathname.replace('/search/',''));
    console.log(searchQuery)
    const [results, setResults] = useState('');
    const [finishedSearch, setFinishedSearch] = useState(false);

    useEffect(() => {
      setResults(getResults(searchQuery));
    }, [])

    useEffect(() => {
      var newSearch = props.location.pathname.replace('/search/','');
      if (searchQuery !== newSearch) {
        window.location.reload();
        setSearchQuery(newSearch);
        setResults(getResults(newSearch));
      }
    }, [props.location.pathname])

    function handleSearchQueryUpdate(event) {
      setSearchQuery(event.target.value);
    }

    function keyPress(e) {
      if(e.keyCode == 13){
         console.log('value', e.target.value);
         props.history.push(`/search/${searchQuery}`);
         window.location.reload();
      }
    }

    function searchButtonClick() {
        props.history.push(`/search/${searchQuery}`);
        window.location.reload();
    }

    function getResults(searchTerm) {
      setTimeout(function() {
        setFinishedSearch(true);
      }, 1000);
      
      return false;
    }

    return (
      <div className="searchresultspage">
        <div className="searchfield">
            <TextField
                id="searchbar"
                defaultValue={searchQuery}
                variant="outlined"
                onChange={handleSearchQueryUpdate}
                onKeyDown={keyPress}
              />
              <div>
                <Link to={`/search/${searchQuery}`} style={{ textDecoration: "none"}}>
                  <Button 
                    id="searchbutton" 
                    variant="contained"
                    style={{ textTransform: "capitalize", marginLeft: "10px", marginTop: "-1px", fontSize: "15px", fontWeight: "bold", height: "55px" }} 
                    color="primary"
                    onClick={() => {searchButtonClick()}}
                  >
                    Search
                  </Button>
                </Link>
              </div>
          </div>
          <div className="searchresults">
            {!finishedSearch &&
              <p>Loading results...</p>
            }
            {finishedSearch && !results &&
              <p>No results found. Please try another search.</p>
            }
          </div>
      </div> 
    );
}

export default SearchResults;