Rails.application.routes.draw do
  root 'welcome#index'
  get '/get_keys', to: 'welcome#get_keys'
end
