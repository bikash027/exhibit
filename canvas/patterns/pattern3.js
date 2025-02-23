export class Pattern3{
    constructor(RADIUS, thita){
        const pattern = new Path2D();
        // pattern.beginPath();
        pattern.moveTo(0, 0);
        const spokeSize = RADIUS * (Math.random() * 0.5 + 0.1)
        // const spokeSize = RADIUS * 0.2;
        const corner1 = {
            x: spokeSize * Math.cos(thita),
            y: spokeSize * Math.sin(thita),
        }
        const corner2 = {
            x: spokeSize * Math.cos(2 * Math.PI - thita),
            y: spokeSize * Math.sin(2 * Math.PI - thita)
        }
        const p2 = {
            x: RADIUS,
            y: 0
        }
        const cp1 = {
            x: spokeSize/2,
            y: 0
        }
        const cp2 = {
            x: (spokeSize + RADIUS) / 2,
            y: 0
        }
        // pattern.lineTo(corner1.x, corner1.y);
        pattern.quadraticCurveTo(cp1.x, cp1.y, corner1.x, corner1.y);
        // pattern.lineTo(p2.x, p2.y);
        pattern.quadraticCurveTo(cp2.x, cp2.y, p2.x, p2.y);
        // pattern.lineTo(corner2.x, corner2.y);
        pattern.quadraticCurveTo(cp2.x, cp2.y, corner2.x, corner2.y);
        // pattern.closePath();
        pattern.quadraticCurveTo(cp1.x, cp1.y, 0, 0);
        this.path = pattern;
    }
}


// export default Pattern1;