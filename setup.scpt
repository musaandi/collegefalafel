tell application "iTerm2"
  tell current window
    create tab with profile "default"
  end tell

  tell first session of current tab of current window
    write text "cd ~/Development/github && subl collegefalafel collegefalafel-api"
    write text "cd ~/Development/github/collegefalafel && subl $(git diff --name-only HEAD~ HEAD)"
    write text "cd ~/Development/github/collegefalafel-api && subl $(git diff --name-only HEAD~ HEAD)"
    write text "less ~/Development/github/collegefalafel/devnotes.txt"
    split vertically with profile "default"
  end tell

  tell second session of current tab of current window
    split horizontally with profile "default"
    write text "cd ~/Development/github/collegefalafel && browser-sync start --server --files '**/*.html, **/*.js, **/*.css'"
  end tell

  tell third session of current tab of current window
    write text "cd ~/Development/github/collegefalafel-api && npm start"
  end tell
end tell