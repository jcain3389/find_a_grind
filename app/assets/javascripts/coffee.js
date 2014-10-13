$(document).ready(function() {
  var parameters = [['category_filter', 'coffee'], ['callback', 'cb'], ['limit', 10], ['sort', 1]];
  var accessor;

  $.ajax({
    'url' : '/get_keys',
    'dataType' : 'json',
    'success' : function(data) {
      parameters.push(['oauth_consumer_key', data.consumerKey]);
      parameters.push(['oauth_consumer_secret', data.consumerSecret]);
      parameters.push(['oauth_token', data.accessToken]);
      parameters.push(['oauth_signature_method', data.serviceProvider.signatureMethod]);
      accessor = {
        consumerSecret : data.consumerSecret,
        tokenSecret : data.accessTokenSecret
      };
    }
  });

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
      'success' : function(data) {
          var shops = '';
          for (i=0; i<data.businesses.length; i++) {
              var business = data.businesses[i];
              var address = business.location.display_address[0] + " " + business.location.city + " " + business.location.state_code + " " + business.location.postal_code
              shops += "<li><span><a href='http://www.google.com/maps/place/" + address + "'>" + business.name + "</a></span><br>";
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







