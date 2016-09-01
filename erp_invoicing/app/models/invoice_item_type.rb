# create_table :invoice_item_types do |t|
#   t.integer :parent_id
#   t.integer :lft
#   t.integer :rgt
# 
#   #custom columns go here
#   t.string :description
#   t.string :comments
#   t.string :internal_identifier
#   t.string :external_identifier
#   t.string :external_id_source
# 
#   t.timestamps
# end

class InvoiceItemType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_erp_type
  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods
end
