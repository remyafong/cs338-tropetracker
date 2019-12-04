import React from 'react';
import "./UrlSearchView.css";
import { Button } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  card: {
    height: "auto",
    width: "100%",
    overflow: "auto",
    display: 'flex',
    marginBottom: 10
  },
  content: {
    display: 'flex'
  },
  media: {
      height: "auto",
      maxHeight: 250,
      width: 300,
      flexGrow: 0,
      display: 'inline-block'
  },
  text: {
    flex: 1,
    flexGrow: 2000,
    display: 'inline-block'
  },
  actions: {
    width: 200,
    flexGrow: 100,
    display: 'inline-block',
  },
  description: {
    color: "blue",
    fontSize: 14
  }
});


const UrlSearchView = (props) => {
    const classes = useStyles();
    
    return (
        <div>
            <div className="tropes">
                {props.tweets.length > 0 && 
                <div>
                    <Card className={classes.card}>
                         <div className={classes.details}>
                          <div>
                          <div className={classes.content}>
                          {props.results[0].articleImg && 
                            <img
                              className={classes.media}
                              src={props.results[0].articleImg}
                              alt={props.results[0].articleTitle}
                            />
                          }   
                             <CardContent className={classes.text}>
                              <Typography gutterBottom variant="h5" component="h2" style={{ fontSize: 18, fontWeight: "bold" }}>
                                {props.results[0].articleTitle}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: 14 }} >
                                {props.results[0].articleDesc}
                              </Typography>
                            </CardContent>
                            </div>
                          </div>
                         </div>
                        </Card>     
                    {props.tropes.map((value, index) => (
                        <ExpansionPanel key={index}>
                            <ExpansionPanelSummary>
                                <h3 className="trope-name">{value.replace(value[0],value[0].toUpperCase())}</h3>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                            <div style={{ display: 'block'}} >
                              <div style={{ marginTop: -10, marginBottom: 20 }}>
                                 <Link to={`/trope/${value}`} target="_blank" className="goToSingleTrope" style={{ textDecoration: "none", color: "#ff8080", fontWeight: "bold", fontSize: 14 }}>View other articles classified as {value.replace(value[0],value[0].toUpperCase())}</Link>
                              </div>
                              <div>
                                  <div>
                                      {props.tweets[index].map((v, i) => (
                                          <div key={v+i}>
                                              <div className="tweet">{v}</div>
                                              <a href={`http://twitter.com/a/status/${props.tweetIds[index][i]}`} rel="noopener noreferrer" target="_blank" style={{ textDecoration: "none"}}>
                                                  <Button 
                                                      variant="outlined"
                                                      style={{ textTransform: "none", fontSize: "15px", fontWeight: "bold", marginLeft: 50 }} 
                                                          color="primary"
                                                      >
                                                      View tweet on Twitter
                                                  </Button>
                                              </a>
                                          </div>
                                      ))}
                                  </div>
                                </div>                
                            </div>

                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))}
                </div>}
            </div>
        </div>
    );
}

export default UrlSearchView;