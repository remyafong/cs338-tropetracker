const bkg = chrome.extension.getBackgroundPage();
let trope = ['Catch 22', 'Not all that Glitters is Gold', 'David and Goliath']

//gets link from the browser
let getLink = () => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
   bkg.console.log("URL IS: ", url)
  });
}


//display tropes  --> don't know if this works
let displayTropes = (foundTropesList) => {
  var toAdd = document.getElementById('links');
    for(let i = 0; i < foundTropesList.length; i++){
      var newDiv = document.createElement('div');
      newDiv.innerText = foundTropesList[i];
      newDiv.className = 'tropes';
      toAdd.appendChild(newDiv);
    }
    document.body.appendChild(toAdd);
    document.getElementById('goToTT').style.visibility = 'visible'
}


// event Listener for Button
document.addEventListener('DOMContentLoaded', function() {
  var submit = document.getElementById('submit');
  var goToTT = document.getElementById('goToTT');
  // onClick's logic below:
  submit.addEventListener('click', function() {
      getLink();
      //pull data from database
      //store in variable
      displayTropes(trope) //pass variable instead of trope
      this.disabled = true;
  });

  goToTT.addEventListener('click', () => {
    
  })

});

