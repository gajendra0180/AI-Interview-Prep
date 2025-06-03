#!/bin/bash

# Simple Backdate Commits Script
# Usage: ./simple_backdate.sh [days_back] [push_interval]

# Default values
DAYS_BACK=${1:-7}        # Default 7 days back
PUSH_INTERVAL=${2:-5}    # Default 5 seconds between pushes

echo "🚀 Backdating Git Commits"
echo "📅 Going back $DAYS_BACK days"
echo "⏱️  Push interval: $PUSH_INTERVAL seconds"
echo "---"

# Check if there are files to commit
if ! git status --porcelain | grep -q .; then
    echo "❌ No changes to commit!"
    exit 1
fi

# Array of realistic commit messages
COMMIT_MESSAGES=(
    "Initial project setup and configuration"
    "Add core dependencies and build tools"
    "Implement basic application structure"
    "Configure TypeScript and linting rules"
    "Add styling and UI components"
    "Implement main features and functionality"
    "Add static assets and resources"
    "Update documentation and README"
    "Fix configuration and setup issues"
    "Optimize build process and dependencies"
)

# Get all files to commit
FILES=($(git ls-files --others --exclude-standard; git diff --name-only))
TOTAL_FILES=${#FILES[@]}

if [ $TOTAL_FILES -eq 0 ]; then
    echo "❌ No files to commit!"
    exit 1
fi

echo "📁 Found $TOTAL_FILES files to commit"

# Calculate commits needed (aim for 2-4 files per commit)
COMMITS_NEEDED=$(( (TOTAL_FILES + 2) / 3 ))
echo "📝 Will create $COMMITS_NEEDED commits"
echo "---"

# Commit files in batches
for ((i=0; i<COMMITS_NEEDED; i++)); do
    # Calculate file range for this commit
    START_IDX=$((i * 3))
    END_IDX=$(( START_IDX + 3 ))
    if [ $END_IDX -gt $TOTAL_FILES ]; then
        END_IDX=$TOTAL_FILES
    fi
    
    # Get files for this commit
    COMMIT_FILES=("${FILES[@]:$START_IDX:$((END_IDX-START_IDX))}")
    
    # Generate random date within the specified range
    DAYS_AGO=$((RANDOM % DAYS_BACK + 1))
    HOUR=$((RANDOM % 12 + 9))  # 9 AM to 8 PM
    MINUTE=$((RANDOM % 60))
    
    # Create backdated timestamp
    COMMIT_DATE=$(date -d "$DAYS_AGO days ago" +"%Y-%m-%d $HOUR:$MINUTE:00")
    
    # Stage files
    for file in "${COMMIT_FILES[@]}"; do
        git add "$file"
    done
    
    # Pick a random commit message
    MSG_IDX=$((RANDOM % ${#COMMIT_MESSAGES[@]}))
    COMMIT_MSG="${COMMIT_MESSAGES[$MSG_IDX]}"
    
    # Create the commit with backdate
    export GIT_AUTHOR_DATE="$COMMIT_DATE"
    export GIT_COMMITTER_DATE="$COMMIT_DATE"
    git commit -m "$COMMIT_MSG"
    
    echo "✅ Commit $((i+1))/$COMMITS_NEEDED: $COMMIT_DATE"
    echo "   📄 Files: ${COMMIT_FILES[*]}"
    echo "   💬 Message: $COMMIT_MSG"
    
    # Push to remote
    echo "   🚀 Pushing..."
    git push origin main
    
    # Wait before next push (except for last one)
    if [ $((i+1)) -lt $COMMITS_NEEDED ]; then
        echo "   ⏳ Waiting $PUSH_INTERVAL seconds..."
        sleep $PUSH_INTERVAL
    fi
    
    echo "---"
done

echo "🎉 All done! Check your GitHub repository."
echo "📊 Your commits are now spread across the last $DAYS_BACK days." 