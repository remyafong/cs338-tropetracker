import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import "./TropeSearchView.css";

const TropeSearchView = (props) => {
    const [tweetPanel, setTweetPanel] = useState(false);
    const [tweetPanelData, setTweetPanelData] = useState();

    function openTweetPanel(articleName,trope,link) {
        var articleName2 = articleName.replace(/[^a-zA-Z0-9]/g,'_');;
        var trope2 = trope.replace(/ /g,'_');
        var tweetIDs = props.articleList[articleName2][trope2]["id"];
        
        var tweets = [];
  
        tweetIDs.forEach((id) => {
          var tweetData = props.tweetList[id];
          if (tweetData && tweetData.hasOwnProperty("text")) {
            tweets.push({link: `http://twitter.com/a/status/${id}`,text: tweetData["text"]});
          }
          else {
            tweets.push({link: "missing", text: "missing"});
          }
        })
  
        setTweetPanelData({trope: trope, articleName: articleName, link: link, tweets: tweets});
        setTweetPanel(true);  
    }

    return (
        <div>
            <div className="tropes">
                {props.results.map((value, index) => (
                    <ExpansionPanel key={index}>
                    <ExpansionPanelSummary>
                        <h4>{value.trope.replace(value.trope[0],value.trope[0].toUpperCase())}</h4>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                        {value.links.map((v,i) => (
                            <div className="entry" key={i}>
                            <div className="url">
                                <a href={v[0]} target="_blank">{v[1]}</a>
                                <p></p>
                            </div>
                            <div className="tweets">
                                <Button 
                                variant="outlined"
                                style={{ textTransform: "capitalize", margin: "8px", fontSize: "15px", fontWeight: "bold" }} 
                                    color="primary"
                                    onClick={() => { openTweetPanel(v[1], value.trope, v[0])}}
                                >
                                View {v[2]} Tweet{v[2] > 1 && 's'}
                            </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                ))}
            </div>
            {tweetPanelData && 
                <Drawer anchor="right" open={tweetPanel} onClose={() => {setTweetPanel(false)}}>
                <div 
                    className="tweetPanel"
                    role="presentation"
                >
                    <div className="tweetPanelHeader">
                    <h3>{tweetPanelData["trope"].replace(tweetPanelData["trope"][0],tweetPanelData["trope"][0].toUpperCase())}</h3>
                    <p></p>
                    <a href={tweetPanelData["link"]} target="_blank">{tweetPanelData["articleName"]}</a>
                    </div>
                    <div className="tweetPanelContent">
                    <h4>Tweets</h4>
                    {tweetPanelData["tweets"].map((value, index) => (
                        <div>
                        <p className="tweetText">{value["text"]}</p>
                        <a href={value["link"]} target="_blank" style={{ textDecoration: "none"}}>
                            <Button 
                                variant="outlined"
                                style={{ textTransform: "none", fontSize: "10px", fontWeight: "bold" }} 
                                    color="primary"
                                >
                                View tweet on Twitter
                            </Button>
                        </a>
                        <p></p>
                        </div>
                    ))}
                    </div>
                </div>
                </Drawer>
            }
        </div>
    )
}

export default TropeSearchView;
            