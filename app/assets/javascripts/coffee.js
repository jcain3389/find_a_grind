$(document).ready(function() {
  var auth = {
    consumerKey : ENV["yelp_consumer_key"],
    consumerSecret : ENV["yelp_consumer_secret"],
    accessToken : ENV["yelp_access_token"],
    accessTokenSecret : ENV["yelp_access_token_secret"],
    serviceProvider : {
        signatureMethod : ENV["yelp_signature_secret"]
    }
  };

  parameters = [];
  parameters.push(['category_filter', 'coffee']);
  parameters.push(['callback', 'cb']);
  parameters.push(['limit', 10]);
  parameters.push(['sort', 1]);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };

  $('#search').live('submit', function(evt) {
    evt.preventDefault();
    getCoffeeData($('#search-keyword').val());
    makeAjaxCall();
  });

  function getCoffeeData(user_location_input) {
    findAndDeleteLocation(parameters);
    parameters.push(['location', user_location_input]);
    message = {
        'action' : 'http://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    parameterMap = OAuth.getParameterMap(message.parameters);
  }

  function makeAjaxCall() {
    $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'dataType' : 'jsonp',
      'jsonpCallback' : 'cb',
      'success' : function(data, textStats, XMLHttpRequest) {
          console.log(data);
          var shops = '';
          for (i=0; i<data.businesses.length; i++) {
              var business = data.businesses[i];
              shops += "<li>" + business.name + ': ';
              for (x=0; x<business.location.display_address.length; x++) {
                  shops += business.location.display_address[x] + " ";
              }
              shops += "</li>";
          }
          $('#results').html(shops);
      }
    });
  }

  function findAndDeleteLocation(array) {
    for(var i = 0; i < array.length; i++){
        if(array[i][0] === 'location') {
            array.splice(i,1);
        }
    }
  }
});







