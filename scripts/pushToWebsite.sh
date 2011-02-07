#!/bin/bash
# pushToWebsite.sh - a script to update our live site

SITENAME = "www.hunterdavis.com"
USERNAME = "goemonh"
OPTIONS = "-B -q -i ./id_rsa.pub"

scp ../js/obfs.js $USERNAME@$SITENAME:~/quickgrapher/js/
scp ../css/quick-graph-less.css $USERNAME@$SITENAME:~/quickgrapher/css/
scp ../quick-graph.html  $USERNAME@$SITENAME:~/quickgrapher/index.html
scp ../quickgrapher-faq.html  $USERNAME@$SITENAME:~/quickgrapher/
scp ../quickgrapher-tutorials.html  $USERNAME@$SITENAME:~/quickgrapher/
scp ../quickgrapher-walkthrough.html  $USERNAME@$SITENAME:~/quickgrapher/

