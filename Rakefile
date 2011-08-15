require 'fileutils'
task default: :build

def check_tree(*dirs)
  tree = "."
  dirs.each do |dir|
    tree << "/#{dir}"
    Dir.mkdir tree unless Dir.exists?(tree)
  end
end

def top_level?(entry)
  entry =~ /^\.+$/
end

task :build do
  puts
  Rake::Task[:manifest].invoke
  Rake::Task[:vendor].invoke
  Rake::Task[:lib].invoke
  Rake::Task[:img].invoke
  Rake::Task[:coffee].invoke
  Rake::Task[:scss].invoke
  Rake::Task[:haml].invoke
  puts "\nDone!"
  puts
end

task :coffee do
  check_tree "ext", "js"
  puts "----> Converting CoffeeScript to JavaScript"
  Dir.entries("./src/coffee/").each do |entry|
    unless top_level?(entry)
      puts "      #{entry}"
      result = %x[coffee --compile --output ext/js/ src/coffee/#{entry}]
      puts result unless result.empty?
    end
  end
end

task :haml do
  check_tree "ext"
  puts "----> Converting HTML to HAML"
  Dir.entries("./src/haml/").each do |entry|
    unless top_level?(entry)
      puts "      #{entry}"
      result = %x[haml -f html5 src/haml/#{entry} ext/#{entry.gsub /\.haml$/, ".html"}] 
      puts result unless result.empty?
    end
  end
end

task :img do
  check_tree "ext", "img"
  puts "----> Copying images"
  Dir.entries("./src/img/").each do |entry|
    unless top_level?(entry)
      puts "      #{entry}"
      FileUtils.copy "src/img/#{entry}", "ext/img"
    end
  end
end

task :lib do
  puts "----> Copying library files"
  FileUtils.copy "lib/js/xlcolorscale-0.5.min.js", "ext/js"
end

task :manifest do
  puts "----> Copying manifest"
  FileUtils.copy "src/manifest.json", "ext"
end

task :scss do
  check_tree "ext", "css"
  puts "----> Converting SCSS to CSS"
  Dir.entries("./src/scss/").each do |entry|
    unless top_level?(entry)
      puts "      #{entry}"
      result = %x[sass --no-cache src/scss/#{entry} ext/css/#{entry.gsub /\.scss$/, ".css"}] 
      puts result unless result.empty?
    end
  end
end

task :vendor do
  puts "----> Copying vendor files"
  FileUtils.copy "vendor/js/jquery-1.6.1.min.js", "ext/js"
end
