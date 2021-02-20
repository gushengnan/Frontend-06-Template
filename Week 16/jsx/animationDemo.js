import { Timeline, Animation } from "./animation";
import { linear, ease, easeIn, easeOut, easeInOut } from './ease';

let tl = new Timeline();

tl.start();

tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, null, easeInOut, v => `translateX(${v}px)`));

document.querySelector('#el2').style.transition = `transform ease-in-out 2s`;
document.querySelector('#el2').style.transform = `translateX(500px)`;

document.querySelector('#pause-btn').addEventListener('click', () => {
    tl.pause();
});

document.querySelector('#resume-btn').addEventListener('click', () => {
    tl.resume();
});