#!/bin/bash
# Linear API shortcuts for faster issue management

# Add to ~/.bashrc for instant access
alias linear-active='~/.linear-utils.sh active'
alias linear-backlog='~/.linear-utils.sh backlog'
alias linear-get='~/.linear-utils.sh get'
alias linear-comment='~/.linear-utils.sh comment'
alias linear-progress='~/.linear-utils.sh progress'

# Quick issue lookup by keyword
linear-find() {
    local keyword="$1"
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $(cat ~/.linear-api-key)" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"query { issues(filter: { title: { contains: \\\"$keyword\\\" } }, orderBy: updatedAt, last: 5) { nodes { id title state { name } updatedAt } } }\"
        }" | jq -r '.data.issues.nodes[] | "\(.id) | \(.title) | \(.state.name)"'
}

echo "Linear API shortcuts loaded:"
echo "  linear-active      # Show active issues"
echo "  linear-backlog     # Show backlog issues"
echo "  linear-find <text> # Find issues by title"
echo "  linear-get <id>    # Get issue details"
echo "  linear-comment <id> 'message'  # Add comment + In Review"
echo "  linear-progress <id>  # Set In Progress"