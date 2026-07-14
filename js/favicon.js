let faviconLinkEl = null;

function ensureFaviconLink() {
    if (!faviconLinkEl) {
        faviconLinkEl = document.getElementById('favicon-dynamic');
        if (!faviconLinkEl) {
            faviconLinkEl = document.createElement('link');
            faviconLinkEl.id = 'favicon-dynamic';
            faviconLinkEl.rel = 'icon';
            faviconLinkEl.type = 'image/png';
            document.head.appendChild(faviconLinkEl);
        }
    }
    return faviconLinkEl;
}

export function updateFavicon(remaining, total, color) {
    const SIZE = 32;
    const c = document.createElement('canvas');
    c.width = SIZE;
    c.height = SIZE;
    const ctx = c.getContext('2d');
    const cx = SIZE / 2, cy = SIZE / 2;
    const r = SIZE / 2 - 1.5;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    const fraction = total > 0 ? remaining / total : 1;
    const startAngle = -Math.PI / 2;
    const sweepEnd = startAngle + fraction * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, sweepEnd);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fill();

    const innerR = r * 0.54;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    const mins = Math.ceil(remaining / 60);
    const label = mins <= 0 ? '0' : String(mins);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = `bold ${label.length > 1 ? 10 : 12}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, cy + 0.5);

    ensureFaviconLink().href = c.toDataURL();
}

export function resetFavicon() {
    ensureFaviconLink().href = 'icons/favicon-32x32.png';
}