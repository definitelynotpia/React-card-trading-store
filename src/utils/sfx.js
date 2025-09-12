import CardFlip1 from "../assets/sfx/card_flip_1.mpeg";
import CardFlip2 from "../assets/sfx/card_flip_2.mpeg";

export const playCardFlipSfx = () => {
    const sounds = [CardFlip1, CardFlip2];
    const randomIndex = Math.floor(Math.random() * sounds.length);
    const audio = new Audio(sounds[randomIndex]);
    audio.play();
};
