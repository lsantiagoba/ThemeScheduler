#!/bin/bash
set -e

UUID="theme-scheduler@lsbcodes"
gnome-extensions disable "$UUID" 2>/dev/null || true
rm -rf "$HOME/.local/share/gnome-shell/extensions/$UUID"
echo "Theme Scheduler uninstalled."
