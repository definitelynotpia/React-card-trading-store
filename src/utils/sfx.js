export const playCardFlipSfx = () => {
    const sounds = [
        '/sfx/card_flip_1.mpeg',
        '/sfx/card_flip_2.mpeg'
    ];
    const randomIndex = Math.floor(Math.random() * sounds.length);
    const audio = new Audio(sounds[randomIndex]);
    audio.play();
};
