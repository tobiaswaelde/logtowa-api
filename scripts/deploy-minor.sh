#!/bin/sh

git checkout main
npm version minor
git push

git checkout deploy
git merge main
git push

git checkout main