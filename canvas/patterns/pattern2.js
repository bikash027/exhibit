export class Pattern2{
    constructor(RADIUS, thita){
        const pattern = new Path2D();
        // pattern.beginPath();
        pattern.moveTo(0, 0);
        const cp1 = {
            x: RADIUS * Math.cos(thita),
            y: RADIUS * Math.sin(thita),
        }
        const cp2 = {
            x: RADIUS * Math.cos(2 * Math.PI - thita),
            y: RADIUS * Math.sin(2 * Math.PI - thita)
        }
        const p2 = {
            x: RADIUS,
            y: 0
        }
        pattern.quadraticCurveTo(cp1.x, cp1.y, p2.x, p2.y);
        // pattern.arc(0, 0, RADIUS, thita, 2 * Math.PI - thita, true);
        pattern.quadraticCurveTo(cp2.x, cp2.y, 0, 0);
        this.path = pattern;
    }
}

// export default Pattern1;