export function playFeedback({ sound }) {
    if (sound === 'none') return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = sound === 'notification' ? 660 : 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
    } catch {}
}

// Gapless ticking via Web Audio. HTMLAudioElement.loop has an audible lull
// at the boundary because of MP3 encoder padding and element scheduling.
// Decoding to an AudioBuffer and looping via AudioBufferSourceNode is
// sample-accurate.
let tickingCtx = null;
let tickingBuffer = null;
let tickingLoading = null;
let tickingSource = null;

function getTickingCtx() {
    if (!tickingCtx) {
        tickingCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return tickingCtx;
}

function loadTickingBuffer() {
    if (tickingBuffer) return Promise.resolve(tickingBuffer);
    if (!tickingLoading) {
        const ctx = getTickingCtx();
        tickingLoading = fetch('audio/ticking-clock.mp3')
            .then(r => r.arrayBuffer())
            .then(buf => ctx.decodeAudioData(buf))
            .then(decoded => { tickingBuffer = decoded; return decoded; });
    }
    return tickingLoading;
}

export async function playTicking() {
    try {
        const ctx = getTickingCtx();
        if (ctx.state === 'suspended') await ctx.resume();
        const buffer = await loadTickingBuffer();
        stopTicking();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(ctx.destination);
        source.start();
        tickingSource = source;
    } catch {}
}

export function stopTicking() {
    if (!tickingSource) return;
    try { tickingSource.stop(); } catch {}
    try { tickingSource.disconnect(); } catch {}
    tickingSource = null;
}
