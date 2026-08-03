#!/usr/bin/env bash
# =============================================================================
# deploy.sh — One-shot deploy for cabinet.github.io (project page)
# Run from the repo root on a machine where `gh` is authenticated:
#     gh auth login        # do this once if not already logged in
#     bash deploy.sh
# =============================================================================
set -e

REPO="diecasting/cabinet.github.io"
cd "$(dirname "$0")"

echo "==> 1) Create repo if it does not exist (public) =="
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public
else
  echo "    repo $REPO already exists, skipping create"
fi

echo "==> 2) Ensure git remote 'origin' = https://github.com/$REPO.git =="
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"

echo "==> 3) Push main branch =="
git push -u origin main

echo "==> 4) Enable GitHub Pages using the GitHub Actions build =="
# Preferred (no scope headaches): do this in the UI:
#   Settings -> Pages -> Build and deployment -> Source = "GitHub Actions"
# Optional API equivalent (needs pages:write scope):
if gh api -X POST "/repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1; then
  echo "    Pages enabled via API (build_type=workflow)"
else
  echo "    API enable failed/skipped — please set Source=GitHub Actions in Settings > Pages"
fi

echo "==> 5) Trigger the workflow run (enablement alone may not auto-run) =="
gh workflow run hugo.yml 2>/dev/null || echo "    (run it manually in the Actions tab if needed)"

echo
echo "Done. Open the Actions tab to watch the build:"
echo "    https://github.com/$REPO/actions"
echo "Live URL (after the workflow finishes):"
echo "    https://diecasting.github.io/cabinet.github.io/"
