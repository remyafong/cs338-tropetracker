import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import './Tropes.css';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const Tropes = (props) => {
	const [loading, setLoading] = useState(true);
	const [tweetPanel, setTweetPanel] = useState(false);
	const [tweetPanelData, setTweetPanelData] = useState();

	useEffect(() => {
		if (props.tropeList.length > 0) {
			setLoading(false);
		}
	}, [props.tropeList])

	function openTweetPanel(articleName,trope,link) {
		var articleName2 = articleName.replace(/[^a-zA-Z0-9]/g,'_');;
		var trope2 = trope.replace(/ /g,'_');
		var tweetIDs = props.articleList[articleName2][trope2]["id"];
		
		var tweets = [];

		console.log(tweetIDs)

		tweetIDs.forEach((id) => {
			var tweetData = props.tweetList[id];
			if (tweetData && tweetData.hasOwnProperty("text")) {
				tweets.push({link: `http://twitter.com/a/status/${id}`,text: tweetData["text"]});
			}
			else {
				tweets.push({link: "missing", text: "missing"});
			}
		})

		console.log(tweets);

		setTweetPanelData({trope: trope, articleName: articleName, link: link, tweets: tweets});
		setTweetPanel(true);	
	}

    return (
		<div className="tropepage">
			<div className="title">
    			<h2>Trope List</h2>
    		</div>
    		{loading && 
    			<p>Loading tropes...</p>
    		}
			{!loading &&
				<div>
	    			<div className="tropes">
		    			{props.tropeList && props.tropeList.map((value, index) => (
					        <ExpansionPanel>
						        <ExpansionPanelSummary>
						          <h4>{value.trope.replace(value.trope[0],value.trope[0].toUpperCase())}</h4>
						        </ExpansionPanelSummary>
						        <ExpansionPanelDetails>
						          <div>
						            {value.links.map((v,i) => (
						            	<div className="entry">
						            		<div className="url">
							            		<a href={v[0]} rel="noopener noreferrer" target="_blank">{v[1]}</a>
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
			    					<a href={tweetPanelData["link"]} rel="noopener noreferrer" target="_blank">{tweetPanelData["articleName"]}</a>
		    					</div>
		    					<div className="tweetPanelContent">
		    						<h4>Tweets</h4>
			    					{tweetPanelData["tweets"].map((value, index) => (
			    						<div>
				    						<p className="tweetText">{value["text"]}</p>
				    						<a href={value["link"]} rel="noopener noreferrer" target="_blank" style={{ textDecoration: "none"}}>
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
    		}
    		
		</div>
    );
}


export default Tropes;