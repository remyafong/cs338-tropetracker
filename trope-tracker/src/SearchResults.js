import React, { useState, useEffect } from 'react';
import "./SearchResults.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';

const SearchResults = (props) => {
    const [results, setResults] = useState('');
    const [finishedSearch, setFinishedSearch] = useState(false);

    useEffect(() => {
      if (props.searchQuery && props.tropeList && props.linkList) {
        console.log(props.tropeList)
        setResults(getResults());
      }
    }, [props.searchQuery, props.tropeList, props.linkList])

    function handleSearchQueryUpdate(event) {
      props.setSearchQuery(event.target.value);
    }

    function getResults() {
      if (props.tropeList.hasOwnProperty(props.searchQuery)) {
        
        setFinishedSearch(true);
        return props.tropeList[props.searchQuery];
      }
      else if (props.linkList.hasOwnProperty(props.searchQuery)) {
        setFinishedSearch(true);
        return props.linkList[props.searchQuery];
      }
      else {
        setFinishedSearch(true);
        return false;
      }
    }

    return (
      <div className="searchresultspage">
        <div className="searchfield">
            <TextField
                id="searchbar"
                style={{ marginRight: 8 }}
                defaultValue={props.searchQuery}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleSearchQueryUpdate}
              />
              <Button 
                id="searchbutton" 
                variant="contained"
                style={{ textTransform: "capitalize", margin: "8px", fontSize: "15px", fontWeight: "bold" }} 
                color="primary"
                component={Link} 
                to={`/search/${props.searchQuery}`}
              >
                Search
              </Button>  
          </div>
          <div className="searchresults">
            {finishedSearch && !results &&
              <p>No results found. Please try another search.</p>
            }
          </div>
      </div> 
    );
}

export default SearchResults;