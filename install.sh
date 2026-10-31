#!/bin/bash
set -e

UUID="theme-scheduler@lsbcodes"
SOURCE_DIR="src/v45-46-47-48-49-50-51"
TARGET="$HOME/.local/share/gnome-shell/extensions/$UUID"
SHELL_VERSION=$(gnome-shell --version | awk '{split($3, version, "."); print version[1]}')

if [ "$SHELL_VERSION" -lt 45 ]; then
    echo "Theme Scheduler requires GNOME Shell 45 or newer."
    exit 1
fi

mkdir -p "$TARGET/schemas" "$TARGET/locale"
cp "$SOURCE_DIR/extension.js" "$SOURCE_DIR/prefs.js" "$SOURCE_DIR/metadata.json" "$TARGET/"
cp schemas/org.gnome.shell.extensions.theme-scheduler.gschema.xml "$TARGET/schemas/"
for po_file in po/*.po; do
    language=$(basename "$po_file" .po)
    mkdir -p "$TARGET/locale/$language/LC_MESSAGES"
    msgfmt "$po_file" -o "$TARGET/locale/$language/LC_MESSAGES/$UUID.mo"
done
glib-compile-schemas "$TARGET/schemas"
gnome-extensions enable "$UUID" 2>/dev/null || true
echo "Theme Scheduler installed. Open its preferences in the Extensions app."
