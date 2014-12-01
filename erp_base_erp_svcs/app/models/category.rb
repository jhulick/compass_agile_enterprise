class Category < ActiveRecord::Base
  acts_as_nested_set

  attr_protected :created_at, :updated_at

  belongs_to :category_record, :polymorphic => true
  has_many :category_classifications, :dependent => :destroy
  
  def self.iid( internal_identifier_string )
    where("internal_identifier = ?",internal_identifier_string.to_s).first
  end

  def to_record_representation
    # returns a string of category descriptions like
    # 'main_category > sub_category n > ... > this category instance'
    if root?
      category.description
    else
      crawl_up_from(self).split('///').reverse.join(' > ')
    end
  end

  def self.to_all_representation
    # returns an array of hashes which represent all categories in nested set order,
    # each of which consists of the category's id and representation
    container_arr = []
    each_with_level(root.self_and_descendants) do |o, level|
      container_arr << {:id => o.id, :description => o.to_representation}
    end
    container_arr
  end

  def to_representation
    # returns a string that consists of 1) a number of dashes equal to
    # the category's level and 2) the category's description attr
    rep = ''
    level.times {rep << '- '}
    rep << description
  end

  private

  def crawl_up_from(category)
    # returns a string that is a '///'-separated list of categories
    # from child category to root
    "#{category.description}///#{crawl_up_from(category.parent) if category != Category.root}"
  end

end
