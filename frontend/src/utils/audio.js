let typingAudio = null;

export function initAudio() {
    if (!typingAudio) {
        typingAudio = new Audio('/assets/typing_sound.mp3');
        typingAudio.loop = true;
        typingAudio.volume = 0.5; // Set to a reasonable level
    }
}

export function startTypingSound() {
    try {
        if (!typingAudio) initAudio();
        if (typingAudio.paused) {
            // It might fail if the user hasn't interacted with the document yet
            typingAudio.play().catch(e => console.warn("Audio play blocked", e));
        }
    } catch (e) {
        console.warn("Audio exception", e);
    }
}

export function stopTypingSound() {
    if (typingAudio && !typingAudio.paused) {
        typingAudio.pause();
    }
}
