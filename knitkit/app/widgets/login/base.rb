
  module Widgets
    module Login
      class Base < ErpApp::Widgets::Base

        def index
          @logout_to  = params[:logout_to]
          @login_to   = params[:login_to]
          @signup_url = params[:signup_url]
    
          render
        end

        def login_header
          @login_url     = params[:login_url]
          @signup_url    = params[:signup_url]
          @authenticated = user_signed_in?
          if user_signed_in?
            @user = current_user
          end
    
          render
        end

        #should not be modified
        #modify at your own risk
        self.view_paths = File.join(File.dirname(__FILE__),"/views")
        
        def locate
          File.dirname(__FILE__)
        end
        
        class << self
          def title
            "Login"
          end
          
          def widget_name
            File.basename(File.dirname(__FILE__))
          end
          
          def base_layout
            begin
              file = File.join(File.dirname(__FILE__),"/views/layouts/base.html.erb")
              IO.read(file)
            rescue
              return nil
            end
          end
        end
      end
    end
  end

