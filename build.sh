#!/bin/bash
set -e

SOURCE_DIR="src/v45-46-47-48-49-50"
cp "$SOURCE_DIR/extension.js" "$SOURCE_DIR/prefs.js" "$SOURCE_DIR/metadata.json" .
mkdir -p schemas
glib-compile-schemas schemas
echo "Theme Scheduler build complete."
