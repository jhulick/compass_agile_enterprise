module Api
  module V1
    class WorkEffortPartyAssignmentsController < BaseController

      def index
        work_effort_party_assignments = WorkEffortPartyAssignment

        if params[:project_id]
          work_effort_party_assignments = work_effort_party_assignments.joins(:work_effort).where('work_efforts.project_id = ?', params[:project_id])
        end

        render :json => {
                   success: true,
                   work_effort_party_assignments: work_effort_party_assignments.all.collect do |work_effort_party_assignment|
                     work_effort_party_assignment.to_data_hash
                   end
               }
      end

      def create
        begin
          ActiveRecord::Base.connection.transaction do

            work_effort_party_assignment = WorkEffortPartyAssignment.new
            work_effort_party_assignment.party_id = params[:party_id]
            work_effort_party_assignment.work_effort_id = params[:work_effort_id]
            work_effort_party_assignment.role_type = RoleType.iid('work_resource')
            work_effort_party_assignment.resource_allocation = params[:resource_allocation]

            render :json => {success: work_effort_party_assignment.save!,
                             work_effort_party_assignment: work_effort_party_assignment.to_data_hash}

          end
        rescue ActiveRecord::RecordInvalid => invalid
          Rails.logger.error invalid.record.errors

          render :json => {:success => false, :message => invalid.record.errors}
        rescue StandardError => ex
          Rails.logger.error ex.message
          Rails.logger.error ex.backtrace.join("\n")

          ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

          render json: {success: false, message: 'Error creating WorkEffortPartyAssignment'}
        end
      end

      def update

        begin
          ActiveRecord::Base.connection.transaction do

            work_effort_party_assignment = WorkEffortPartyAssignment.find(params[:id])
            work_effort_party_assignment.party_id = params[:party_id]
            work_effort_party_assignment.work_effort_id = params[:work_effort_id]
            work_effort_party_assignment.role_type = RoleType.iid('work_resource')
            work_effort_party_assignment.resource_allocation = params[:resource_allocation]

            render :json => {success: work_effort_party_assignment.save!,
                             work_effort_party_assignment: work_effort_party_assignment.to_data_hash}

          end
        rescue ActiveRecord::RecordInvalid => invalid
          Rails.logger.error invalid.record.errors

          render :json => {:success => false, :message => invalid.record.errors}
        rescue StandardError => ex
          Rails.logger.error ex.message
          Rails.logger.error ex.backtrace.join("\n")

          ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

          render json: {success: false, message: 'Error updating WorkEffortPartyAssignment'}
        end

      end

      def destroy

        work_effort_party_assignment = WorkEffortPartyAssignment.find(params[:id])

        begin
          ActiveRecord::Base.connection.transaction do

            render json: {success: work_effort_party_assignment.destroy}

          end
        rescue StandardError => ex
          Rails.logger.error ex.message
          Rails.logger.error ex.backtrace.join("\n")

          ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

          render json: {success: false, message: 'Error destroying WorkEffortPartyAssignment'}
        end

      end

    end # WorkEffortPartyAssignmentsController
  end # V1
end # Api