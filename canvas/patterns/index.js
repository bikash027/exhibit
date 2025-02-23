import { Pattern1 } from "./pattern1.js";
import { Pattern2 } from "./pattern2.js";
import { Pattern3 } from "./pattern3.js";
import { Pattern4 } from "./pattern4.js";
import { Pattern5 } from "./pattern5.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 500;
const HEIGHT = 500;
const PINK = '#F5A9B8';
const BLUE = 'rgb(3, 158, 214)';
const RADIUS = 200;
const drawPattern = (pattern) => {
    for(let i = 0; i < 2 * Math.PI / thita; i++){
        ctx.save();
        ctx.rotate(i * thita);
        ctx.beginPath();
        ctx.stroke(pattern.path);
        ctx.restore();
    }
}

ctx.translate(WIDTH/2, HEIGHT/2);
ctx.scale(1, -1);

ctx.strokeStyle = PINK;
ctx.fillStyle = PINK;
const thita = Math.PI/6;
const patterns = [
    // new Pattern1(RADIUS, thita / 2),
    // new Pattern2(3*RADIUS/4, thita / 2),
    new Pattern3(2*RADIUS/3, thita / 2),
    // new Pattern4(RADIUS, thita / 2),
    new Pattern5(RADIUS, thita / 2)
];
patterns.forEach(pattern => {
    drawPattern(pattern);
})
// drawPattern(pattern4);
// drawPattern(pattern41);
// drawPattern(pattern42);









