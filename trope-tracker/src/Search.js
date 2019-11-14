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
    function handleSearchQueryUpdate(event) {
      props.setSearchQuery(event.target.value);
    }

    function keyPress(e){
      if(e.keyCode == 13){
         console.log('value', e.target.value);
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
            style={{ margin: 8 }}
            placeholder="Enter a trope or news article url..."
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleSearchQueryUpdate}
            onKeyDown={keyPress}
          /> 
          <Button 
            id="searchbuttonhome" 
            variant="contained"
            style={{ textTransform: "capitalize", margin: "8px", fontSize: "15px", fontWeight: "bold" }} 
            color="primary"
            component={Link} 
            to={`/search/${props.searchQuery}`}
          >
            Search
          </Button>
        </div> 
      </div> 
    );
}

export default Search;
