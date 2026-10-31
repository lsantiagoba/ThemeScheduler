#!/bin/bash
set -e

UUID="theme-scheduler@lsbcodes"
SOURCE_DIR="src/v45-46-47-48-49-50-51"
rm -f "$UUID.zip"
gnome-extensions pack "$SOURCE_DIR" \
    --schema="../../schemas/org.gnome.shell.extensions.theme-scheduler.gschema.xml" \
    --podir="../../po" \
    --gettext-domain="$UUID" \
    --force --out-dir=.
echo "Created $UUID.shell-extension.zip"
