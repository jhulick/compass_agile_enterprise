require "active_record"

namespace :compass do
  namespace :backup do
  	
  	PG_BACKUP_DIR = '/backup/postgres'
  	SU_POSTGRES = true 
  	TIMESTAMP_FORMAT = "%Y-%m-%d_%Hh%Mm%Ss" # keep a single underscore or the purge_old task will break
  	@purge_dumps_older_than = 2.weeks.ago
  	
  	desc 'backup all postgres databases'
    task :postgres => :environment do
      create_directory(PG_BACKUP_DIR)

      databases = ActiveRecord::Base.connection.select_values('SELECT datname FROM pg_database;')

      puts red("Backing up ALL postgres databases via pg_dump")
      databases.each do |db|
        unless db == "template0"
          puts "Dumping #{db} to #{PG_BACKUP_DIR}"
          cmd = "pg_dump #{db} > #{PG_BACKUP_DIR}/#{db}_#{Time.now.strftime(TIMESTAMP_FORMAT)}.pgsql"
          cmd = "sudo su postgres -c \"#{cmd}\"" if SU_POSTGRES
          execute_command(cmd)
        else
          puts "Skipping template0 database ..."
        end
      end
      
      puts "\nBackup Complete."
    end

    namespace :postgres do
      task :purge_old do
        puts "Purging postgres dumps older than #{@purge_dumps_older_than}"
        chdir(PG_BACKUP_DIR)
        
        # get list of files and loop thru them
        files = Dir.glob("*.pgsql")

        files.each do |f|
          puts "Examining dump #{f}"
          # split filename
          filename_split = f.split('_')
          
          # get timestamp
          timestamp = filename_split[-2] + ' ' + filename_split[-1]
          timestamp = timestamp.gsub('.pgsql', '')
          timestamp = timestamp.gsub('h', ':')
          timestamp = timestamp.gsub('m', ':')
          timestamp = timestamp.gsub('s', '')
          
          # convert timestamp to Time object
          timeobject = Time.parse(timestamp)

          # compare time object with purge_dumps_older_than and delete if too old
          if timeobject < @purge_dumps_older_than
            puts red("Purging dump #{f}: Older than #{@purge_dumps_older_than}")
            cmd = "rm -f #{f}"
            execute_command(cmd)
          end        
        end
        
      end
    end
    
    def create_directory(foldername)
      FileUtils.mkdir_p(foldername) unless File.directory?(foldername)
    end

    def green(text); 
      colorize(text, "\033[32m")
    end

    def red(text)
      colorize(text, "\033[31m")
    end

    def colorize(text, color_code)
      "#{color_code}#{text}\033[0m"
    end

    def execute_command(cmd)
      puts green(cmd)
      system cmd
    end    
  end
end
