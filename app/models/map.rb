class Map
  def initialize sheet
    @sheet = sheet
  end

  def get_table
    table = []
    cols = @sheet.rows[0]
    @sheet.rows.slice(1..@sheet.rows.count).each { |r| 
      row = {};  
      cols.each_index{ |i| 
        row[cols[i]] = r[i]
      }
      table.push(row)
    }
    table
  end



end

