#!/bin/bash
# Lightweight ESLint wrapper for basic code checking

if [ "$1" = "--version" ]; then
    echo "ESLint Wrapper v1.0"
    exit 0
fi

# Simple ESLint check for JavaScript files
if [ -f "$1" ]; then
    npx eslint --format json "$1" 2>/dev/null || echo '[]'
else
    echo "File not found: $1"
fi