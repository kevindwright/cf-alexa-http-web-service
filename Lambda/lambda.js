var Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const SKILL_NAME='Apartment Occupancy';
const WELCOME_MESSAGE= 'Welcome to ' + SKILL_NAME + '. ' ;
const HELP_MESSAGE='You can ask me to get a summary, or get occupancy, for a particular property and week.';
const HELP_REPROMPT='Would you like me to get occupancy data for a property?';
const STOP_MESSAGE= 'OK .. If you want any thing else, just let me know!';


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    //alexa.appId = 'amzn1.ask.skill.5276637a-44b1-4ce8-b516-b7e27e494ad9';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    
    'LaunchRequest': function () {
        this.emit('WelcomeIntent');
    },
    'getOccupancyIntent': function () {
        
        global.weekVal = this.event.request.intent.slots.weekEnding.value
        global.propertyVal = this.event.request.intent.slots.selectedProperty.resolutions.resolutionsPerAuthority[0].values[0].value.id

        httpGetOccupancy((myResult) => {

                var PropertyName = myResult.DATA.PROPNAME
                var PropertyID = myResult.DATA.PROPNUM
                var weekEnding = myResult.DATA.WEEKENDING
                var OccPer = myResult.DATA.OCCPERCENT
                var Vacancy = myResult.DATA.VACANCY

                var strResponse = PropertyName + ' had a vacancy of ' + Vacancy + ' units for an occupancy rate of ' + OccPer + ' percent for the week ending  ' + weekEnding
               
                //this.response.speak(strResponse);
                //this.emit(':responseReady');
                this.emit(':ask', strResponse, '');
               
            }
        );
    },
    'getSummaryIntent': function () {
        
        global.weekVal = this.event.request.intent.slots.weekEnding.value
        global.propertyVal = this.event.request.intent.slots.selectedProperty.resolutions.resolutionsPerAuthority[0].values[0].value.id

        httpGetSummary((myResult) => {

                var PropertyName = myResult.DATA.PROPNAME
                var PropertyID = myResult.DATA.PROPNUM
                var weekEnding = myResult.DATA.WEEKENDING
                var Traffic = myResult.DATA.TRAFFIC
                var Rented = myResult.DATA.RENTED
                var MoveIn = myResult.DATA.MOVEIN
                var MoveOut = myResult.DATA.MOVEOUT
                var SchedRent = myResult.DATA.SCHEDRENT
                var DelRent = myResult.DATA.DELQRENT
                var OccPer = myResult.DATA.OCCPERCENT
                var Vacancy = myResult.DATA.VACANCY
                
                var plurMoveIn=''
                if(MoveIn!=1){plurMoveIn='s'}
                var plurMoveOut=''
                if(MoveOut!=1){plurMoveOut='s'}
                var plurRented=''
                if(Rented!=1){plurRented='s'}
                var plurVacancy=''
                if(Vacancy!=1){plurVacancy='s'}

                var strResponse = 'For the week ending ' + weekEnding + ' ' + PropertyName + ' had '
                strResponse = strResponse + MoveIn + ' Move in' + plurMoveIn + ' and ' + MoveOut + ' Move out' + plurMoveOut
                strResponse = strResponse + '. Foot traffic was ' + Traffic + ' and out of that,  they rented ' +Rented+ ' unit' + plurRented + '.'
                strResponse = strResponse + ' Scheduled rent was ' + SchedRent + ' dollars and they had ' + DelRent + ' in delinquency.'
                strResponse = strResponse + ' Vacancy of ' + Vacancy + ' unit' + plurVacancy + ' for an occupancy rate of ' + OccPer + ' percent.'


                this.emit(':ask', strResponse, '');
            }
        );
    },
    'getLocationIntent': function () {
        
        global.propertyVal = this.event.request.intent.slots.selectedProperty.resolutions.resolutionsPerAuthority[0].values[0].value.id

        httpGetLocation((myResult) => {

	            var PropertyName = myResult.DATA.PROPNAME
                var Address = myResult.DATA.ADDRESS
                var City = myResult.DATA.CITY
                var State = myResult.DATA.STATE

                var strResponse = PropertyName + ' is located at ' + Address + ' in the city of ' + City + ', ' + State
               
                this.emit(':ask', strResponse, '');
                
                /*
                var cardTitle = PropertyName;
                var cardContent = Address + ' ' + City + ' ' + State;
                var imageObj = { smallImageUrl: 'https://s3.amazonaws.com/kinetic-assets/RB_sm.jpg', largeImageUrl: 'https://s3.amazonaws.com/kinetic-assets/RB_lg.jpg' };
                var repromptSpeech = HELP_REPROMPT;
                this.emit(':askWithCard', strResponse, repromptSpeech, cardTitle, cardContent, imageObj);
               */
            }
        );
    },
    'WelcomeIntent': function () {
        this.emit(':ask', WELCOME_MESSAGE + HELP_MESSAGE);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        //this.emit(':ask', speechOutput, reprompt);
        this.emit(':ask', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function () {
        const HelpMessage = HELP_REPROMPT;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
};


var http = require('http');
// http is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/http.html

function httpGetOccupancy(callback) {

   var sPath = '/alexa.cfm?method=getOccupancy&property=' + propertyVal + '&weekEnding=' + weekVal;
   
   var options = {
        host: 'alexa.kineticinteractive.com',
        port: 80,
        path: sPath,
        method: 'GET',
    };
    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // parse through it to extract the needed data
            var occData = JSON.parse(returnData);
            callback(occData);  
        });
        
    });
    req.end();
}

function httpGetSummary(callback) {

   var sPath = '/alexa.cfm?method=getSummary&property=' + propertyVal + '&weekEnding=' + weekVal;
   
   var options = {
        host: 'alexa.kineticinteractive.com',
        port: 80,
        path: sPath,
        method: 'GET',
    };
    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // parse through it to extract the needed data
            var occData = JSON.parse(returnData);
            callback(occData);  
        });
        
    });
    req.end();
}


function httpGetLocation(callback) {

   var sPath = '/alexa.cfm?method=getLocation&property=' + propertyVal;
   
   var options = {
        host: 'alexa.kineticinteractive.com',
        port: 80,
        path: sPath,
        method: 'GET',
    };
    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // parse through it to extract the needed data
            var occData = JSON.parse(returnData);
            callback(occData);  
        });
        
    });
    req.end();
}