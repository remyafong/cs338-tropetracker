import React, { useState } from 'react';
import "./Search.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

const Search = (props) => {
    const [searchQuery, setSearchQuery] = useState(null);

    function handleSearchQueryUpdate(event) {
      setSearchQuery(event.target.value);
    }

    function keyPress(e){
      if(e.keyCode == 13){
         props.history.push(`/search/${searchQuery}`);
      }
    }
 
    return (  
      <div className="searchpage">
        <div className="title">
          <h1>Trope Tracker</h1>
        </div>
        <div className="searchfield">
          <TextField
            id="searchbarhome"
            placeholder="Enter a trope or news article url..."
            variant="outlined"
            onChange={handleSearchQueryUpdate}
            onKeyDown={keyPress}
          /> 
          <div>
            <Link to={`/search/${searchQuery}`} style={{ textDecoration: "none"}}>
              <Button 
                id="searchbuttonhome" 
                variant="contained"
                style={{ textTransform: "capitalize", marginLeft: "10px", marginTop: "-1px", fontSize: "15px", fontWeight: "bold", height: "55px" }} 
                color="primary"
              >
                Search
              </Button>
            </Link>
          </div>
        </div> 
      </div> 
    );
}

export default Search;
