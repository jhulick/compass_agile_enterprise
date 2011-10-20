module ErpServices::Base::ContactMgtCallbacks

  def after_initialize()
    if self.new_record? and self.contact.nil?
      self.contact = Contact.new
      self.contact.description = self.description
    end
  end

end