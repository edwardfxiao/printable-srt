#!/bin/bash

# Check if directory parameter is provided
while getopts "d:" opt; do
  case $opt in
    d) directory="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
        exit 1
    ;;
  esac
done

# Check if directory exists
if [ ! -d "$directory" ]; then
    echo "Error: Directory '$directory' not found"
    exit 1
fi

# Loop through all .srt files in the specified directory
for file in "$directory"/*.srt; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        node transform.js "$file"
    fi
done

echo "Processing complete!"