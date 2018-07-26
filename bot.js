var models = require('./models/models');
var User = models.User;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


var googleCalendar = require('./index')
var authorize = googleCalendar.authorize;
var getAccessToken = googleCalendar.getAccessToken;
var listEvents = lgoogleCalendar.listEvents;
var createEvent = googleCalendar.createEvent;

const { RTMClient, WebClient } = require('@slack/client');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

// Get an API token by creating an app at <https://api.slack.com/apps?new_app=1>
// It's always a good idea to keep sensitive data like the token outside your source code. Prefer environment variables.
const token = process.env.SLACK_TOKEN || '';
if (!token) { console.log('You must specify a token to use this example'); process.exitCode = 1; return; }
// Initialize an RTM API client
const rtm = new RTMClient(token);
const web = new WebClient(token);
// Start the connection to the platform
rtm.start();
// Log all incoming messages
rtm.on('message', (event) => {
  // Structure of `event`: <https://api.slack.com/events/message

  User.findOne({slackUserId: event.user}, (err, user) =>{

    if(err){
      console.log(err)
    }
    if(!user || event.user ==="UBW1SS291"){
      fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), createEvent);
      });
      let user = new User({
        slackUserId: event.user,
        token:{}
      })
      user.save()
      .then( (user)=> {console.log('success', user)})
      .catch((err) =>{
        console.log(err);
      })
   }
    if(user && event.user !== "UBW1SS291"){
      // console.log(`Welcome Back ${event.user}, You said: ${event.text}`);
      // web.chat.postMessage(event.user, () => {`Welcome Back ${event.user}, You said: ${event.text}`});
      rtm.sendMessage(`Welcome Back ${event.user}, You said: ${event.text}`, event.channel);
    }

 })
})

  // console.log(event);


// Log all reactions
rtm.on('reaction_added', (event) => {
  // Structure of `event`: <https://api.slack.com/events/reaction_added>
  console.log(`Reaction from ${event.user}: ${event.reaction}`);
});
rtm.on('reaction_removed', (event) => {
  // Structure of `event`: <https://api.slack.com/events/reaction_removed>
  console.log(`Reaction removed by ${event.user}: ${event.reaction}`);
});
// Send a message once the connection is ready
rtm.on('ready', (event) => {
  // Getting a conversation ID is left as an exercise for the reader. It's usually available as the `channel` property
  // on incoming messages, or in responses to Web API requests.
  // const conversationId = '';
  // rtm.sendMessage('Hello, world!', conversationId);
});
