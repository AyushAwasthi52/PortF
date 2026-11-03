#!/bin/bash

# Check if commit message is provided
if [ $# -eq 0 ]; then
    echo "Usage: ./push.sh \"commit message\""
    exit 1
fi

COMMIT_MSG="$1"

git add .

if ! git commit -m "$COMMIT_MSG"; then
    echo "Commit failed."
    exit 1
fi

if ! git pull --rebase origin main; then
    echo "Pull/rebase failed. Please resolve conflicts."
    exit 1
fi

if ! git push origin main; then
    echo "Push failed."
    exit 1
fi

echo "Successfully pushed to GitHub!"