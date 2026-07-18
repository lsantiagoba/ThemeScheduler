#!/bin/bash
set -e

SOURCE_DIR="src/v45-46-47-48-49-50"
cp "$SOURCE_DIR/extension.js" "$SOURCE_DIR/prefs.js" "$SOURCE_DIR/metadata.json" .
mkdir -p schemas
glib-compile-schemas schemas
for po_file in po/*.po; do
    language=$(basename "$po_file" .po)
    mkdir -p "locale/$language/LC_MESSAGES"
    msgfmt "$po_file" -o "locale/$language/LC_MESSAGES/theme-scheduler@lsbcodes.mo"
done
echo "Theme Scheduler build complete."
