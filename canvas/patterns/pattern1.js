export class Pattern1{
    constructor(RADIUS, thita){
        const pattern = new Path2D();
        // pattern.beginPath();
        pattern.moveTo(0, 0);
        const p1 = {
            x: RADIUS * Math.cos(thita),
            y: RADIUS * Math.sin(thita),
        }
        const cp = {
            x: RADIUS,
            y: 0
        }
        pattern.quadraticCurveTo(cp.x, cp.y, p1.x, p1.y);
        pattern.arc(0, 0, RADIUS, thita, 2 * Math.PI - thita, true);
        pattern.quadraticCurveTo(cp.x, cp.y, 0, 0);
        this.path = pattern;
    }
}