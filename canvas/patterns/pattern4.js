export class Pattern4{
    constructor(RADIUS, thita){
        this.RADIUS = RADIUS;
        this.thita = thita;
        const pattern = new Path2D();
        pattern.addPath(this.newVinePath());
        pattern.addPath(this.newVinePath({reflection: true}))
        this.path = pattern;
    }

    newVinePath({reflection = false}={}){
        const thita = reflection == false
            ? this.thita
            : 2 * Math.PI - this.thita;
        const vineSize = this.RADIUS / 10;
        const vineCorner1 = {
            x: this.RADIUS * Math.cos(thita),
            y: this.RADIUS * Math.sin(thita),
        }
        const vineCorner2 = {
            x: (this.RADIUS - vineSize) * Math.cos(thita),
            y: (this.RADIUS - vineSize) * Math.sin(thita),
        }
        const vineTip = {
            x: vineCorner1.x /4,
            y: vineCorner1.y /4
        }
        const cp1 = {
            // x: 3 * this.RADIUS / 4,
            x: this.RADIUS,
            y: 0
        }
        const cp2 = {
            x: cp1.x - vineSize * 2 * Math.cos(thita),
            y: cp1.y + vineSize * 2 * Math.sin(thita)
        }
        const vine = new Path2D();
        vine.moveTo(vineCorner1.x, vineCorner1.y)
        vine.quadraticCurveTo(cp1.x, cp1.y, vineTip.x, vineTip.y)
        vine.quadraticCurveTo(cp2.x, cp2.y, vineCorner2.x, vineCorner2.y)
        vine.closePath();
        return vine
    }
}


// export default Pattern1;