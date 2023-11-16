#!/bin/sh

git checkout main
npm version patch
git push

git checkout deploy
git merge main
git push

git checkout main