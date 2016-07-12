class AddInventoryTxns < ActiveRecord::Migration
  def up

    unless table_exists? :inventory_txns
      create_table :inventory_txns do |t|

        t.references :fixed_asset
        t.references :inventory_entry

        t.decimal :quantity
        t.decimal :acutal_quantity
        t.text :comments
        t.boolean :applied, default: false
        t.datetime :applied_at

        t.integer :tenant_id

        t.text :custom_fields

      end

      add_index :inventory_txns, :fixed_asset_id, name: 'inv_txn_fixed_asset_idx'
      add_index :inventory_txns, :inventory_entry_id, name: 'inv_txn_inv_entry_idx'
      add_index :inventory_txns, :tenant_id, name: 'inv_txn_tenant_id_idx'
    end

  end

  def down

    if table_exists? :inventory_txns
      drop_table :inventory_txns
    end

  end
end
