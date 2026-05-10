import { COLOR_THEMES } from './constants.js';
import { requestNotificationPermission } from './notifications.js';

let cb = null;

export function initSettingsPage(callbacks) {
    cb = callbacks;

    document.getElementById('settings-back').addEventListener('click', closeSettings);

    document.querySelectorAll('.duration-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const key = tile.dataset.key;
            const valueEl = document.getElementById(`tile-${key}`);
            editNumberInPlace(valueEl, cb.getDurations()[key], 1, 60, v => {
                cb.onDurationChange(key, v);
            });
        });
    });

    document.querySelectorAll('.pref-number-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const pref = tile.dataset.pref;
            const min = parseInt(tile.dataset.min, 10);
            const max = parseInt(tile.dataset.max, 10);
            const valueEl = document.getElementById(`pref-${pref}`);
            editNumberInPlace(valueEl, cb.getSettings()[pref], min, max, v => {
                cb.onPrefChange(pref, v);
            });
        });
    });

    document.querySelectorAll('.sound-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const s = tile.dataset.sound;
            const current = cb.getSettings().sound;
            const next = (current === s) ? 'none' : s;
            cb.onSoundChange(next);
            refreshSoundUI(next);
        });
    });

    document.querySelectorAll('.toggle-tile').forEach(tile => {
        tile.addEventListener('click', async e => {
            const pref = tile.dataset.pref;
            const yesBtn = tile.querySelector('.toggle-yes');
            const noBtn = tile.querySelector('.toggle-no');
            const current = cb.getSettings()[pref];
            let next;
            if (yesBtn.contains(e.target)) next = true;
            else if (noBtn.contains(e.target)) next = false;
            else next = !current;

            if (pref === 'showNotification' && next === true) {
                const result = await requestNotificationPermission();
                if (result !== 'granted') next = false;
            }

            cb.onPrefChange(pref, next);
            yesBtn.classList.toggle('active', next === true);
            noBtn.classList.toggle('active', next !== true);
        });
    });
}

export function openSettings() {
    if (!cb) return;
    const durations = cb.getDurations();
    const settings = cb.getSettings();

    document.getElementById('tile-focus').textContent = durations.focus;
    document.getElementById('tile-short').textContent = durations.short;
    document.getElementById('tile-long').textContent = durations.long;

    document.getElementById('pref-pomodorosUntilLongBreak').textContent = settings.pomodorosUntilLongBreak;
    document.getElementById('pref-dailyGoal').textContent = settings.dailyGoal;

    refreshSoundUI(settings.sound);
    refreshToggleUI(settings);
    buildColorGrid(settings.color);

    document.getElementById('settings-page').classList.remove('hidden');
}

export function closeSettings() {
    document.getElementById('settings-page').classList.add('hidden');
}

function refreshSoundUI(sound) {
    ['notification', 'alarm'].forEach(s => {
        const tile = document.querySelector(`.sound-tile[data-sound="${s}"]`);
        const icon = document.getElementById(`snd-${s}-icon`);
        const isActive = sound === s;
        tile.classList.toggle('active', isActive);
        icon.textContent = isActive ? '✓' : '✗';
    });
}

function refreshToggleUI(settings) {
    document.querySelectorAll('.toggle-tile').forEach(tile => {
        const val = settings[tile.dataset.pref];
        tile.querySelector('.toggle-yes').classList.toggle('active', val === true);
        tile.querySelector('.toggle-no').classList.toggle('active', val !== true);
    });
}

function buildColorGrid(currentColor) {
    const grid = document.getElementById('color-grid');
    grid.innerHTML = '';
    COLOR_THEMES.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.dataset.color = color;
        if (color === currentColor) swatch.classList.add('selected');

        const dot = document.createElement('span');
        dot.className = 'swatch-dot';
        dot.style.background = color;
        swatch.appendChild(dot);

        const check = document.createElement('span');
        check.className = 'swatch-check';
        check.textContent = '✓';
        swatch.appendChild(check);
        swatch.addEventListener('click', () => {
            grid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
            cb.onColorChange(color);
        });
        grid.appendChild(swatch);
    });
}

function editNumberInPlace(valueEl, currentVal, min, max, onCommit) {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentVal;
    input.min = min;
    input.max = max;
    input.className = valueEl.className + ' num-edit';
    valueEl.replaceWith(input);
    input.focus();
    input.select();

    let committed = false;
    function commit() {
        if (committed) return;
        committed = true;
        const v = Math.max(min, Math.min(max, parseInt(input.value, 10) || currentVal));
        valueEl.textContent = v;
        input.replaceWith(valueEl);
        onCommit(v);
    }
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { committed = true; input.replaceWith(valueEl); }
    });
}
