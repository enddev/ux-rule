#!/bin/bash

for filename in ./tests/*.js
do
	echo "Running ${filename}"
	node "${filename}"
done
