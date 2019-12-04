import React, { useState, useEffect } from 'react';
import "./SearchResults.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import * as TropeQueries from "../../TropeQueries";
import cheerio from 'cheerio';
import TropeSearchView from '../TropeSearchView/TropeSearchView.js'

const SearchResults = (props) => {
    const [searchQuery, setSearchQuery] = useState(props.location.pathname.replace('/search/',''));
    const [results, setResults] = useState('');
    const [finishedSearch, setFinishedSearch] = useState(false);
    const [isTropeSearch, setTropeSearch] = useState(true);
    const [suggestTrope, toggleSuggestTrope] = useState(false);

    useEffect(() => {
      if (props.tropeList.length > 0) {
        setResults(getResults(searchQuery));
      }
      
    }, [props.tropeList])

    useEffect(() => {
      var newSearch = props.location.pathname.replace('/search/','');
      if (searchQuery !== newSearch) {
        window.location.reload();
      }
    }, [props.location.pathname])

    function handleSearchQueryUpdate(event) {
      setSearchQuery(event.target.value);
    }

    function keyPress(e) {
      if(e.keyCode == 13){
         props.history.push(`/search/${searchQuery}`);
         window.location.reload();
      }
    }

    function searchButtonClick() {
        props.history.push(`/search/${searchQuery}`);
        window.location.reload();
    }

    function getResults(searchTerm) {
      if (!searchTerm.includes("/")) {
        var searchWords = searchTerm.toLowerCase().split(" ");
        var tropeMatches = [];

        TropeQueries.forEach((trope) => {
          if (searchWords.every(item => trope["name"].toLowerCase().includes(item))) {
            tropeMatches.push(trope);
          }
        })
  
        if (tropeMatches.length > 0) {
          var tropes = [];
          tropeMatches.forEach((t) => {
            var trope = props.tropeList.find(x => x.trope == t["name"]);
            if (trope !== undefined) {
              tropes.push(trope);
            }
          })
          console.log("it was a trope", tropes);
          setFinishedSearch(true);
          return tropes;
        }
        else {
          setFinishedSearch(true);
          return [];
        }
      }
      else {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const fullUrl = proxyUrl + searchTerm
        const urlResponse = fetch(fullUrl); // this needs to await
        const htmlString = urlResponse.text(); // and maybe this too
        const $ = cheerio.load(htmlString); // here also
        const articleTitle = $('head title').text();
        console.log(articleTitle)
        let searchResults = [];
        Object.entries(props.articleList).forEach(([k, v]) => {
          if (v.articleTitle === articleTitle) {
            searchResults.push(v)
          }
        })
        setFinishedSearch(true);
        console.log(searchResults)
        return searchResults;
      }
    }

    return (
      <div className="searchresultspage">
        <div className="searchfield">
           <div className="child">

            <TextField
                id="searchbar"
                defaultValue={searchQuery}
                variant="outlined"
                onChange={handleSearchQueryUpdate}
                onKeyDown={keyPress}
              />
            </div>
              <div className="child">
                  <Button 
                    id="searchbutton" 
                    variant="contained"
                    style={{ textTransform: "capitalize", marginLeft: "10px", marginTop: "-1px", fontSize: "15px", fontWeight: "bold", height: "55px" }} 
                    color="primary"
                    onClick={() => {searchButtonClick()}}
                  >
                    Search
                  </Button>
              </div>
          </div>
          <div className="searchresults">
            {!finishedSearch &&
              <p>Loading results...</p>
            }
            {finishedSearch && results.length === 0 &&
              <p><span style={{ fontWeight: 'bold' }}>No results found</span>. Please try another search, visit the <Link to='/tropes' style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>Tropes</Link> page for a list of existing tropes, or <Link onClick={() => toggleSuggestTrope(true)} style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>suggest a new trope</Link>!</p>
            }
            {suggestTrope && 
              <div style={{left: 0}} >
                <iframe align="left" src="https://docs.google.com/forms/d/e/1FAIpQLSeAeg2L5Z4jYwzBYyMCz3BZKPf00CY4vEnorplLn3jReEq0vA/viewform?embedded=true" width="640" height="800" frameborder="0" marginheight="0" marginwidth="0"></iframe>
              </div>
            }
            {finishedSearch && results.length > 0 && isTropeSearch &&
              <TropeSearchView results={results} articleList={props.articleList} tweetList={props.tweetList}></TropeSearchView>
            }
          </div> 
      </div> 
    );
}

export default SearchResults;