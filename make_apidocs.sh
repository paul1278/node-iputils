#!/bin/bash
DOCS=`npx jsdoc2md -c .jsdoc-settings.json --files lib/`
sed -i "/# API documentation/q" README.md
printf "$DOCS" >> README.md
printf "\n\n---\n&copy; /dev/paul" >> README.md