#!/bin/bash

sed -i -- "s/\(unreleased\)/`date +%Y-%m-%d`/g" CHANGES.txt
rm CHANGES.txt--
grunt bump:$@
grunt all
git add .
git ci -am "Release"
git checkout production
git pull
git merge master
git checkout master
git merge production
grunt bump:prerelease
sed -i -- '5i\
X.X.X (unreleased)
5i\
==================
5i\
\
- Nothing changed yet.
5i\
\
' CHANGES.txt
rm CHANGES.txt--
git ci -am "Postrelease"
