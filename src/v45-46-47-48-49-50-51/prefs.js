import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ThemeSchedulerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        this.initTranslations();
        const _ = this.gettext.bind(this);
        const settings = this.getSettings();
        window.set_default_size(620, 520);

        const schedulePage = new Adw.PreferencesPage({
            title: _('Schedule'),
            icon_name: 'preferences-system-time-symbolic',
        });
        window.add(schedulePage);

        const scheduleGroup = new Adw.PreferencesGroup({
            title: _('Theme schedule'),
            description: _('Times use your computer’s local clock and the 24-hour format.'),
        });
        schedulePage.add(scheduleGroup);
        this._addTimeRow(scheduleGroup, settings, _('Light theme starts'), 'light-hour', 'light-minute');
        this._addTimeRow(scheduleGroup, settings, _('Dark theme starts'), 'dark-hour', 'dark-minute');

        const noteGroup = new Adw.PreferencesGroup();
        noteGroup.add(new Adw.ActionRow({
            title: _('Changes are automatic'),
            subtitle: _('The current theme is updated as soon as you change either time.'),
        }));
        schedulePage.add(noteGroup);

        const aboutPage = new Adw.PreferencesPage({title: _('About'), icon_name: 'help-about-symbolic'});
        window.add(aboutPage);
        const aboutGroup = new Adw.PreferencesGroup({title: _('Theme Scheduler')});
        aboutPage.add(aboutGroup);

        const donateRow = new Adw.ActionRow({
            title: _('Support development'),
            subtitle: _('If Theme Scheduler helps you, consider making a donation.'),
        });
        const donateButton = new Gtk.Button({
            label: _('Donate'),
            valign: Gtk.Align.CENTER,
            css_classes: ['suggested-action'],
        });
        donateButton.connect('clicked', () =>
            Gtk.show_uri(window, 'https://paypal.me/leandrosb3', Gdk.CURRENT_TIME));
        donateRow.add_suffix(donateButton);
        aboutGroup.add(donateRow);

        const sourceRow = new Adw.ActionRow({
            title: _('Source code'),
            subtitle: 'github.com/lsantiagoba/ThemeScheduler',
            activatable: true,
        });
        sourceRow.add_suffix(new Gtk.Image({icon_name: 'external-link-symbolic'}));
        sourceRow.connect('activated', () =>
            Gtk.show_uri(window, 'https://github.com/lsantiagoba/ThemeScheduler', Gdk.CURRENT_TIME));
        aboutGroup.add(sourceRow);
    }

    _addTimeRow(group, settings, title, hourKey, minuteKey) {
        const row = new Adw.ActionRow({title});
        const box = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, spacing: 6, valign: Gtk.Align.CENTER});
        const hour = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({lower: 0, upper: 23, step_increment: 1, page_increment: 1}),
            numeric: true,
            width_chars: 2,
        });
        const separator = new Gtk.Label({label: ':'});
        const minute = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({lower: 0, upper: 59, step_increment: 1, page_increment: 5}),
            numeric: true,
            width_chars: 2,
        });
        settings.bind(hourKey, hour, 'value', Gio.SettingsBindFlags.DEFAULT);
        settings.bind(minuteKey, minute, 'value', Gio.SettingsBindFlags.DEFAULT);
        box.append(hour);
        box.append(separator);
        box.append(minute);
        row.add_suffix(box);
        group.add(row);
    }
}
