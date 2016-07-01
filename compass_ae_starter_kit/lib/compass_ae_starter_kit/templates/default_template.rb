load File.join(File.dirname(__FILE__), '../file_support.rb')

File.unlink 'public/index.html' rescue Errno::ENOENT
FileUtils.cp File.join(File.dirname(__FILE__), '../../../public', 'index.html'), 'public/index.html'

CompassAeStarterKit::FileSupport.patch_file 'config/initializers/session_store.rb',
                                            "# #{app_const}.config.session_store :active_record_store",
                                            "#{app_const}.config.session_store :active_record_store #use active_record for session storage, this is needed for knitkit",
                                            :patch_mode => :change

CompassAeStarterKit::FileSupport.patch_file 'config/routes.rb',
                                            "#{app_const}.routes.draw do",
                                            "  #mount CompassAE engines
  ErpBaseErpSvcs.mount_compass_ae_engines(self)",
                                            :patch_mode => :insert_after

CompassAeStarterKit::FileSupport.patch_file 'config/environments/production.rb',
                                            "  config.serve_static_assets = false",
                                            "  config.serve_static_assets = true",
                                            :patch_mode => :change

CompassAeStarterKit::FileSupport.patch_file 'app/assets/javascripts/application.js',
                                            "  //= require_tree .",
                                            "  // require_tree. (this was removed by CompassAE because CompassAE loads different assets based on the application container you are using)",
                                            :patch_mode => :change

CompassAeStarterKit::FileSupport.append_file 'Gemfile',
                                             "
gem 'erp_base_erp_svcs', '~> 4.2'
gem 'erp_tech_svcs', '~> 4.2'
gem 'compass_ae_sencha', '~> 2.2'
gem 'erp_app', '~> 4.2'
gem 'knitkit', '~> 3.2'
gem 'rails_db_admin', '~> 3.2'
gem 'compass_ae_console', '~> 3.2'
"
puts <<-end

Thanks for installing Compass AE!

We've performed the following tasks:

* Replaced the index.html page from /public with our Compass AE splash screen
* patched config/initializers/session_store.rb to use ActiveRecord for your session store
* patched config/environments/production.rb and set config.serve_static_assets = true
* patched config/environments/production.rb and set config.assets.compile = true
* Added the core Compass AE gems to your Gemfile

Now we will bundle it up and run the migrations...

end
