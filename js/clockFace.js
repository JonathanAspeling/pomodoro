export function resizeCanvas(canvas, sizeRefEl) {
    if (!canvas || !sizeRefEl) return;
    const size = sizeRefEl.offsetWidth;
    canvas.width = size;
    canvas.height = size;
}

export function drawSweep(canvas, remaining, total, color) {
    if (!canvas || !canvas.width) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    if (remaining <= 0) return;

    const fraction = Math.min(remaining / total, 1);
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + fraction * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
}

export function generateTicks(clockFaceEl, count) {
    if (!clockFaceEl) return;
    clockFaceEl.querySelectorAll('.tick').forEach(t => t.remove());
    const radius = clockFaceEl.offsetHeight / 2;
    const step = 360 / count;
    for (let i = 0; i < count; i++) {
        const tick = document.createElement('div');
        tick.className = 'tick';
        tick.style.transformOrigin = `50% ${radius + 16}px`;
        tick.style.transform = `rotate(${i * step}deg)`;
        clockFaceEl.appendChild(tick);
    }
}
