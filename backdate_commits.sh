#!/bin/bash

# Backdate Commits Script
# This script commits files in batches with backdated timestamps and pushes them with intervals

set -e

# Configuration
DAYS_BACK=30  # How many days back to start from
COMMITS_PER_DAY_MIN=1  # Minimum commits per day
COMMITS_PER_DAY_MAX=3  # Maximum commits per day
PUSH_INTERVAL=10  # Seconds between pushes (adjust as needed)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting backdated commit process...${NC}"

# Get list of all untracked and modified files
mapfile -t ALL_FILES < <(git ls-files --others --exclude-standard && git diff --name-only)

if [ ${#ALL_FILES[@]} -eq 0 ]; then
    echo -e "${YELLOW}No files to commit!${NC}"
    exit 0
fi

echo -e "${GREEN}Found ${#ALL_FILES[@]} files to commit${NC}"

# Function to get random commit message
get_commit_message() {
    local file_type="$1"
    case "$file_type" in
        "package.json"|"package-lock.json")
            echo "Add project dependencies and configuration"
            ;;
        "tsconfig.json"|"eslint.config.mjs"|".eslintrc.json")
            echo "Configure TypeScript and linting setup"
            ;;
        "next.config.ts"|"postcss.config.mjs")
            echo "Configure Next.js and PostCSS settings"
            ;;
        "README.md")
            echo "Update project documentation"
            ;;
        "src/"*)
            echo "Implement core application features"
            ;;
        "public/"*)
            echo "Add static assets and resources"
            ;;
        ".gitignore")
            echo "Configure git ignore patterns"
            ;;
        *)
            echo "Add project files and improvements"
            ;;
    esac
}

# Function to create commit with backdate
create_backdated_commit() {
    local files=("$@")
    local days_ago=$((RANDOM % DAYS_BACK + 1))
    local hour=$((RANDOM % 16 + 8))  # Between 8 AM and 11 PM
    local minute=$((RANDOM % 60))
    
    # Calculate the date
    local commit_date
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        commit_date=$(date -v-${days_ago}d +"$hour:%M:00 %Y-%m-%d")
    else
        # Linux
        commit_date=$(date -d "${days_ago} days ago" +"%Y-%m-%d ${hour}:${minute}:00")
    fi
    
    # Stage files
    for file in "${files[@]}"; do
        git add "$file"
    done
    
    # Get commit message based on first file
    local commit_msg
    commit_msg=$(get_commit_message "${files[0]}")
    
    # Create commit with backdate
    GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
        git commit -m "$commit_msg"
    
    echo -e "${GREEN}✅ Committed files with date: $commit_date${NC}"
    echo -e "${BLUE}   Files: ${files[*]}${NC}"
}

# Group files intelligently
declare -a config_files=()
declare -a source_files=()
declare -a asset_files=()
declare -a other_files=()

for file in "${ALL_FILES[@]}"; do
    case "$file" in
        "package.json"|"package-lock.json"|"tsconfig.json"|"*.config.*"|".eslintrc.json"|"eslint.config.mjs"|"next.config.ts"|"postcss.config.mjs")
            config_files+=("$file")
            ;;
        "src/"*)
            source_files+=("$file")
            ;;
        "public/"*)
            asset_files+=("$file")
            ;;
        *)
            other_files+=("$file")
            ;;
    esac
done

# Commit in logical groups
all_groups=()

# Configuration files first
if [ ${#config_files[@]} -gt 0 ]; then
    all_groups+=("config")
fi

# Source files in batches
if [ ${#source_files[@]} -gt 0 ]; then
    local batch_size=3
    for ((i=0; i<${#source_files[@]}; i+=batch_size)); do
        all_groups+=("source_$((i/batch_size))")
    done
fi

# Asset files
if [ ${#asset_files[@]} -gt 0 ]; then
    all_groups+=("assets")
fi

# Other files
if [ ${#other_files[@]} -gt 0 ]; then
    all_groups+=("other")
fi

# Process each group
for group in "${all_groups[@]}"; do
    case "$group" in
        "config")
            create_backdated_commit "${config_files[@]}"
            ;;
        "source_"*)
            local batch_num=${group#source_}
            local start_idx=$((batch_num * 3))
            local end_idx=$((start_idx + 3))
            if [ $end_idx -gt ${#source_files[@]} ]; then
                end_idx=${#source_files[@]}
            fi
            local batch_files=("${source_files[@]:$start_idx:$((end_idx-start_idx))}")
            create_backdated_commit "${batch_files[@]}"
            ;;
        "assets")
            create_backdated_commit "${asset_files[@]}"
            ;;
        "other")
            create_backdated_commit "${other_files[@]}"
            ;;
    esac
    
    # Push with interval
    echo -e "${BLUE}🚀 Pushing to remote...${NC}"
    git push origin main
    
    if [ "$group" != "${all_groups[-1]}" ]; then
        echo -e "${YELLOW}⏱️  Waiting ${PUSH_INTERVAL} seconds before next push...${NC}"
        sleep $PUSH_INTERVAL
    fi
done

echo -e "${GREEN}🎉 All commits pushed successfully with backdated timestamps!${NC}"
echo -e "${BLUE}📊 Check your GitHub repository to see the distributed commit history.${NC}" 