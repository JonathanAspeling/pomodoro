export function renderDots(container, dailyGoal, groupSize) {
    if (!container) return;
    container.innerHTML = '';
    let remaining = dailyGoal;
    while (remaining > 0) {
        const count = Math.min(groupSize, remaining);
        const group = document.createElement('div');
        group.className = 'dot-group';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            group.appendChild(dot);
        }
        container.appendChild(group);
        remaining -= count;
    }
}

export function updateDots(container, activeCount) {
    if (!container) return;
    container.querySelectorAll('.dot-group .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i < activeCount);
    });
}
