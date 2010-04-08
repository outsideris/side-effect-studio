desc "deploy the application to slicehost"
task :deploy do
  require 'rubygems'
  require 'highline/import'
  require 'net/ssh'

  branch = "master"

    commands = <<EOF
cd ~/apps/nodejs/cached-copy
git checkout #{branch}
git pull origin #{branch}
git checkout -f
EOF
  commands = commands.gsub(/\n/, "; ")
  system("ssh nodejs '#{commands}'")
end
