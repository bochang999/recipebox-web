#!/bin/bash
# Linear Issue Management Utils
# 毎回の許可なしでLinear APIを使用するためのユーティリティ

# 設定
LINEAR_API_KEY=$(cat ~/.linear-api-key)
TEAM_ID=$(cat ~/.linear-team-id)
IN_PROGRESS_ID="1cebb56e-524e-4de0-b676-0f574df9012a"
IN_REVIEW_ID="33feb1c9-3276-4e13-863a-0b93db032a0f"

# 進行中・未開始のissue一覧取得
get_active_issues() {
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $LINEAR_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "query": "query { issues(filter: { state: { type: { in: [\"unstarted\", \"started\"] } } }, orderBy: updatedAt, last: 10) { nodes { id title description state { name } createdAt updatedAt } } }"
        }'
}

# 特定issue詳細取得
get_issue() {
    local issue_id="$1"
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $LINEAR_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"query { issue(id: \\\"$issue_id\\\") { id title description state { name } comments { nodes { id body createdAt user { name } } } } }\"
        }"
}

# issue にコメント追加 + In Review変更
add_comment_and_review() {
    local issue_id="$1"
    local comment_body="$2"
    
    # コメント追加
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $LINEAR_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"mutation { commentCreate(input: { issueId: \\\"$issue_id\\\", body: \\\"$comment_body\\\" }) { comment { id } } }\"
        }" > /dev/null
    
    # In Reviewに変更
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $LINEAR_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"mutation { issueUpdate(id: \\\"$issue_id\\\", input: { stateId: \\\"$IN_REVIEW_ID\\\" }) { issue { id state { name } } } }\"
        }" > /dev/null
    
    echo "✅ Comment added and status changed to In Review"
}

# issue をIn Progressに変更
set_in_progress() {
    local issue_id="$1"
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $LINEAR_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"mutation { issueUpdate(id: \\\"$issue_id\\\", input: { stateId: \\\"$IN_PROGRESS_ID\\\" }) { issue { id state { name } } } }\"
        }" > /dev/null
    echo "✅ Status changed to In Progress"
}

# Backlog issues取得
get_backlog_issues() {
    curl -s -X POST "https://api.linear.app/graphql" \
        -H "Authorization: $LINEAR_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "query": "query { issues(filter: { state: { name: { eq: \"Backlog\" } } }, orderBy: updatedAt, last: 10) { nodes { id title description state { name } updatedAt } } }"
        }'
}

# 使用方法表示
case "$1" in
    "active")
        echo "📋 Active Issues:"
        get_active_issues
        ;;
    "backlog")
        echo "📋 Backlog Issues:"
        get_backlog_issues
        ;;
    "get")
        get_issue "$2"
        ;;
    "comment")
        add_comment_and_review "$2" "$3"
        ;;
    "progress")
        set_in_progress "$2"
        ;;
    *)
        echo "Usage: $0 {active|backlog|get <issue_id>|comment <issue_id> <message>|progress <issue_id>}"
        echo "Examples:"
        echo "  $0 active          # Show active issues"
        echo "  $0 backlog         # Show backlog issues" 
        echo "  $0 get issue_id    # Get issue details"
        echo "  $0 comment issue_id 'message'  # Add comment and set In Review"
        echo "  $0 progress issue_id  # Set to In Progress"
        ;;
esac