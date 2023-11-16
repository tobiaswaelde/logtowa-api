#!/bin/sh

git checkout main
npm version major
git push

git checkout deploy
git merge main
git push

git checkout main