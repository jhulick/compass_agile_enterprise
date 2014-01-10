class Facility < ActiveRecord::Base

  has_many :inventory_entry_locations
  has_many :inventory_entries, :through => :inventory_entry_locations

end