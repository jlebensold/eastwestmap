require 'google_spreadsheet'
class HomeController < ApplicationController
  def mapcoord
    send_file("#{Rails.root}/public/images/pointy.gif",{
        :filename => "tile.gif",
        :disposition => 'inline'
      })
  end
  def index
    keys = YAML::load(ERB.new(File.read("#{Rails.root}/config/gdata.yml")).result).stringify_keys
    session = GoogleSpreadsheet.login(keys[Rails.env]["email"], keys[Rails.env]["password"])
    key = '0AhodtM_0InjodENhamhKbEZvLVVqQllwaHhTdlZLRlE'
    @map = Map.new(session.spreadsheet_by_key(key).worksheets[0]).get_table
=begin
    @map = [{"title"=>"Berling thing",
  "date"=>"1912",
  "map"=>"europe",
  "description"=>"something cool",
  "lat"=>"52.708491",
  "place"=>"Berlin",
  "long"=>"14.024068"},
 {"title"=>"Stuttgart thing",
  "date"=>"1913",
  "map"=>"europe",
  "description"=>"hello world",
  "lat"=>"48.869304",
  "place"=>"Stuttgart",
  "long"=>"9.320336"}]

    pp @map
=end
  end


end
