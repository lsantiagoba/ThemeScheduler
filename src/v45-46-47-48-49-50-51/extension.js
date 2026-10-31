import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const MINUTES_PER_DAY = 24 * 60;

export default class ThemeSchedulerExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._interfaceSettings = new Gio.Settings({schema_id: 'org.gnome.desktop.interface'});
        this._changedId = this._settings.connect('changed', () => this._applyScheduledTheme());

        this._applyScheduledTheme();
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 30, () => {
            this._applyScheduledTheme();
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = 0;
        }
        if (this._settings && this._changedId) {
            this._settings.disconnect(this._changedId);
            this._changedId = 0;
        }
        this._interfaceSettings = null;
        this._settings = null;
    }

    _applyScheduledTheme() {
        const now = GLib.DateTime.new_now_local();
        const current = now.get_hour() * 60 + now.get_minute();
        const lightStart = this._settings.get_int('light-hour') * 60 +
            this._settings.get_int('light-minute');
        const darkStart = this._settings.get_int('dark-hour') * 60 +
            this._settings.get_int('dark-minute');

        // The most recently passed start time wins, including schedules that
        // cross midnight (for example, dark at 19:00 and light at 07:00).
        const sinceLight = (current - lightStart + MINUTES_PER_DAY) % MINUTES_PER_DAY;
        const sinceDark = (current - darkStart + MINUTES_PER_DAY) % MINUTES_PER_DAY;
        const colorScheme = sinceLight <= sinceDark ? 'prefer-light' : 'prefer-dark';

        if (this._interfaceSettings.get_string('color-scheme') !== colorScheme)
            this._interfaceSettings.set_string('color-scheme', colorScheme);
    }
}
