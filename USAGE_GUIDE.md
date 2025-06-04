# Backdate Commits Usage Guide

This guide explains how to use the backdating commit scripts to push your code to GitHub with realistic timestamps.

## What These Scripts Do

- **Commit files in batches** with backdated timestamps
- **Push commits with intervals** to make it look natural
- **Use realistic commit messages** based on file types
- **Spread commits across multiple days** in the past

## Files Created

1. **`simple_backdate.sh`** - Simple, easy-to-use script (recommended)
2. **`backdate_commits.sh`** - Advanced script with more features

## Quick Start (Recommended)

```bash
# Basic usage - goes back 7 days, 5 second intervals
./simple_backdate.sh

# Custom: go back 14 days with 10 second intervals
./simple_backdate.sh 14 10

# Custom: go back 30 days with 3 second intervals
./simple_backdate.sh 30 3
```

## Before Running

Make sure you have:
1. ✅ Git repository initialized
2. ✅ Remote origin set up (GitHub)
3. ✅ Files ready to commit (untracked or modified)
4. ✅ Git configured with your name and email

## Script Parameters

### simple_backdate.sh
- **First parameter**: Days to go back (default: 7)
- **Second parameter**: Seconds between pushes (default: 5)

### Examples

```bash
# Go back 3 days, push every 2 seconds
./simple_backdate.sh 3 2

# Go back 21 days, push every 15 seconds  
./simple_backdate.sh 21 15

# Use defaults (7 days back, 5 second intervals)
./simple_backdate.sh
```

## What Happens

1. **File Detection**: Script finds all untracked and modified files
2. **Batching**: Groups files into logical commits (2-4 files each)
3. **Backdating**: Creates commits with random timestamps in the past
4. **Realistic Messages**: Uses appropriate commit messages
5. **Interval Pushing**: Pushes each commit with delays between them

## Sample Output

```
🚀 Backdating Git Commits
📅 Going back 7 days
⏱️  Push interval: 5 seconds
---
📁 Found 12 files to commit
📝 Will create 4 commits
---
✅ Commit 1/4: 2024-01-15 14:23:00
   📄 Files: package.json package-lock.json tsconfig.json
   💬 Message: Initial project setup and configuration
   🚀 Pushing...
   ⏳ Waiting 5 seconds...
---
```

## Important Notes

⚠️ **Warning**: This modifies your git history. Only use on new repositories or before sharing with others.

🔒 **GitHub Detection**: GitHub shows the "push" time, not commit time, so this helps make your activity look more natural.

⏰ **Timing**: Commits are randomly distributed within business hours (9 AM - 8 PM) on random days within your specified range.

📝 **Messages**: Commit messages are chosen based on file types to look realistic.

## Troubleshooting

- **"No changes to commit"**: Make sure you have untracked or modified files
- **Push fails**: Check your GitHub credentials and remote setup
- **Permission denied**: Make sure script is executable (`chmod +x script_name.sh`)

## Advanced Usage

For more control, edit the script variables:
- Modify `COMMIT_MESSAGES` array for custom messages
- Change time ranges in the date calculation
- Adjust files per commit ratio

That's it! Your commits will now appear distributed across multiple days with realistic timestamps. 🎉 