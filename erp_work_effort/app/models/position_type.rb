class PositionType < ActiveRecord::Base

  attr_protected :created_at, :updated_at

  tracks_created_by_updated_by

  class << self
    def iid(internal_identifier)
      find_by_internal_identifier(internal_identifier)
    end
  end
end
