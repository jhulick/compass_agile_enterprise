require 'ext_scaffold/ext_scaffold'
require 'acts_as_app_container'
require 'has_user_preferences'
require 'erp_app_helper'

#add the observers path to load_paths
ActiveSupport::Dependencies.load_paths << RAILS_ROOT + "#{File.dirname(__FILE__)}/app/observers"

#remove this plugin for the load once paths
ActiveSupport::Dependencies.load_once_paths -= ActiveSupport::Dependencies.load_once_paths.select{|path| path =~ %r(^#{File.dirname(__FILE__)}) }

#if model exists in app/model this plugins model needs reloaded every request
#this runs only once when in production mode
config.to_prepare do
  RAILS_DEFAULT_LOGGER.debug("** reloading #{self.name} plugin") if RAILS_DEFAULT_LOGGER
  self.reload
end

