module ErpWorkEffort
  module Services
    class UnitConverter

      def initialize(unit)
        @unit = unit
      end

      def <(unit)
        case @unit
        when :ms
          case unit
          when :ms
            false
          else
            true
          end

        when :mi
          case unit
          when :ms, :mi
            false
          else
            true
          end

        when :h
          case unit
          when :ms, :mi, :h
            false
          else
            true
          end
        when :w
          case unit
          when :ms, :mi, :h, :w
            false
          else
            true
          end

        when :d
          case unit
          when :ms, :mi, :h, :d, :w
            false
          else
            true
          end

        when :mo
          case unit
          when :ms, :mi, :h, :d, :w, :mo
            false
          else
            true
          end

        when :a
          case unit
          when :ms, :mi, :h, :d, :w, :mo, :a
            false
          else
            true
          end

        when :y
          false

        else
          raise 'Unknown interval'
        end
      end

      def <=(unit)
        if @unit == unit
          true
        else
          self.send('<', unit)
        end
      end

      def >(unit)
        case @unit
        when :ms
          case unit
          when :ms
            false
          else
            false
          end

        when :mi
          case unit
          when :ms
            true
          else
            false
          end

        when :h
          case unit
          when :ms, :mi
            true
          else
            false
          end

        when :d
          case unit
          when :ms, :mi, :h
            true
          else
            false
          end

        when :w
          case unit
          when :ms, :mi, :h, :d
            true
          else
            false
          end

        when :mo
          case unit
          when :ms, :mi, :h, :d, :w
            true
          else
            false
          end

        when :a
          case unit
          when :ms, :mi, :h, :d, :w, :mo
            true
          else
            false
          end

        when :y
          false

        else
          raise 'Unknown interval'
        end
      end

      def >=(unit)
        if @unit == unit
          true
        else
          self.send('>', unit)
        end
      end

      class << self

        # Converts one unit to another
        #
        # @param {Number} amount Amount to convert
        # @param {Symbol} from_unit Unit to convert from
        # @param {Symbol} to_unit Unit to convert to
        def convert_unit(amount, from_unit, to_unit)
          amount = amount.to_f

          if from_unit != to_unit
            # first convert to seconds
            case from_unit
            when :ms
              amount = (amount / 1000)
            when :mi
              amount = amount * 60
            when :h
              amount = ((amount * 60) * 60)
            when :d
              amount = (((amount * 60) * 60) * ErpWorkEffort::Config.hours_per_day)
            when :w
              amount = ((((amount * 60) * 60) * ErpWorkEffort::Config.hours_per_day) * ErpWorkEffort::Config.days_per_week)
            when :mo
              amount = ((((amount * 60) * 60) * ErpWorkEffort::Config.hours_per_day) * ErpWorkEffort::Config.days_per_month)
            when :a
              amount = (((((amount * 60) * 60) * 24) * ErpWorkEffort::Config.days_per_month) * 3)
            when :y
              amount = ((((((amount * 60) * 60) * 24) * ErpWorkEffort::Config.days_per_month) * 3) * 4)
            else
              raise 'Unknown interval'
            end

            # then convert to the desired interval
            case to_unit
            when :ms
              amount = (amount * 1000)
            when :mi
              amount = amount / 60
            when :h
              amount = ((amount / 60) / 60)
            when :d
              amount = (((amount / 60) / 60) / ErpWorkEffort::Config.hours_per_day)
            when :w
              amount = ((((amount / 60) / 60) / ErpWorkEffort::Config.hours_per_day) / ErpWorkEffort::Config.days_per_week)
            when :mo
              amount = ((((amount / 60) / 60) / ErpWorkEffort::Config.hours_per_day) / ErpWorkEffort::Config.days_per_month)
            when :a
              amount = ((((amount / 60) / 60)  / ErpWorkEffort::Config.days_per_month) / 3)
            when :y
              amount = ((((((amount / 60) / 60) / 24) / ErpWorkEffort::Config.days_per_month) / 3) / 4)
            else
              raise 'Unknown interval'
            end
          end

          amount
        end

        # Converts human time interval to unit
        #
        # @param [String] interval Human interval
        # @return [String] unit
        def convert_human_time_interval_to_unit(interval)
          case interval.singularize
          when 'millisecond'
            'ms'
          when 'second'
            's'
          when 'minute'
            'mi'
          when 'hour'
            'h'
          when 'day'
            'd'
          when 'week'
            'w'
          when 'month'
            'mo'
          when 'quarter'
            'q'
          when 'year'
            'y'
          else
            raise 'Unknown interval'
          end
        end

        # Converts time unit to human readable interval
        #
        # @param [String] unit Time unit
        # @param [Integer] value Value of unit
        # @return [String] Human readable interval
        def convert_time_unit_to_human_time_interval(unit, value)
          description = case unit
          when :ms
            'millisecond'
          when :s
            'second'
          when :mi
            'minute'
          when :h
            'hour'
          when :d
            'day'
          when :w
            'week'
          when :mo
            'month'
          when :a
            'quarter'
          when :y
            'year'
          else
            raise 'Unknown interval'
          end

          if value > 1
            description = description.pluralize
          end

          description
        end

      end

    end
  end # Services
end # ErpWorkEffort
