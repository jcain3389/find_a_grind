class WelcomeController < ApplicationController
  def index

  end

  def get_keys
    @auth_data = {
      "consumerKey" => ENV["yelp_consumer_key"],
      "consumerSecret" => ENV["yelp_consumer_secret"],
      "accessToken" => ENV["yelp_access_token"],
      "accessTokenSecret" => ENV["yelp_access_token_secret"],
      "serviceProvider" => {
        "signatureMethod" => ENV["yelp_signature_secret"]
      }
    }

    render :json => @auth_data
  end
end
