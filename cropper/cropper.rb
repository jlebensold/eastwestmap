require 'rubygems'
require 'rmagick'
include Magick
require 'pp'


(0..31).each do |i|
  (0..22).each do |j|
    image = Magick::Image.read('/Users/jon/Desktop/large-map.jpg').first
    face=image.crop!(i*256,j*256,256,256)
    face.write("/Users/jon/Desktop/ew_#{i}_#{j}.jpg")
    puts "writing #{i}_#{j}"
  end
end



