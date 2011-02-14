#!/bin/bash
# pushToWebsite.sh - a script to update our live site

echo "Run this script from the base directory to update site"
echo "type ok or something to continue, or ctrl-c to break"
read something
SITENAME="www.hunterdavis.com"
USERNAME="goemonh"
OPTIONS=" -q -i ./scripts/id_rsa"

echo executing scp $OPTIONS  ./js/obfs.js $USERNAME@$SITENAME:~/html/quickgrapher/js/ 
scp $OPTIONS  ./js/obfs.js $USERNAME@$SITENAME:~/html/quickgrapher/js/
echo executing scp $OPTIONS ./css/jquery-ui-1.8.9.custom.css $USERNAME@$SITENAME:~/html/quickgrapher/css/
scp $OPTIONS ./css/jquery-ui-1.8.9.custom.css $USERNAME@$SITENAME:~/html/quickgrapher/css/
echo executing scp $OPTIONS ./css/less-style.css $USERNAME@$SITENAME:~/html/quickgrapher/css/
scp $OPTIONS ./css/less-style.css $USERNAME@$SITENAME:~/html/quickgrapher/css/
echo executing scp $OPTIONS ./index.html  $USERNAME@$SITENAME:~/html/quickgrapher/index.html
scp $OPTIONS ./index.html  $USERNAME@$SITENAME:~/html/quickgrapher/index.html
echo executing scp $OPTIONS ./quickgrapher-faq.html  $USERNAME@$SITENAME:~/html/quickgrapher/
scp $OPTIONS ./quickgrapher-faq.html  $USERNAME@$SITENAME:~/html/quickgrapher/
echo executing scp $OPTIONS ./quickgrapher-tutorials.html  $USERNAME@$SITENAME:~/html/quickgrapher/
scp $OPTIONS ./quickgrapher-tutorials.html  $USERNAME@$SITENAME:~/html/quickgrapher/
echo executing scp $OPTIONS ./quickgrapher-walkthrough.html  $USERNAME@$SITENAME:~/html/quickgrapher/
scp $OPTIONS ./quickgrapher-walkthrough.html  $USERNAME@$SITENAME:~/html/quickgrapher/
echo executing scp -r $OPTIONS ./images $USERNAME@$SITENAME:~/html/quickgrapher/images/
scp -r $OPTIONS ./images $USERNAME@$SITENAME:~/html/quickgrapher/
echo All Done!
