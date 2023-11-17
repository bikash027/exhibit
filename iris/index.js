const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 500;
const HEIGHT = 500;
const WHITE = '#FFF';
const BLUE = '#5BCEFA';
const RADIUS = 200;

ctx.translate(WIDTH/2, HEIGHT/2);
ctx.scale(1, -1);

ctx.lineWidth = 2
ctx.moveTo(RADIUS/3,0);
ctx.arc(0, 0, RADIUS/3, 0, Math.PI * 2, true);
ctx.fillStyle = BLUE;
ctx.fill();
ctx.strokeStyle = WHITE;
ctx.fillStyle = WHITE;
const toCartesian = ({radius, degree}) => {
    return {
        x: radius * Math.cos(degree * Math.PI / 180),
        y: radius * Math.sin(degree * Math.PI / 180)
    }
}

for(let thita = 0; thita < 360; thita+=1){
    const drawSpike = Math.floor(Math.random() + 0.5) == 0? false: true;
    if(!drawSpike)
        continue;
    ctx.beginPath()
    const spikeDepth = RADIUS/3 + Math.random() * (1 * RADIUS / 3);
    const peakPosition = toCartesian({
        radius: spikeDepth,
        degree:  thita
    })
    const base = toCartesian({
        radius: RADIUS,
        degree: thita
    })
    const baseWidthDegree = 12;
    const baseEnd1 = toCartesian({
        radius: RADIUS,
        degree: thita + baseWidthDegree/2
    });
    const baseEnd2 = toCartesian({
        radius: RADIUS,
        degree: thita - baseWidthDegree/2
    })
    const controlPoint1 = toCartesian({
        radius: RADIUS,
        degree: thita + baseWidthDegree/4
    });
    const controlPoint2 = toCartesian({
        radius: RADIUS,
        degree: thita - baseWidthDegree/4
    })

    ctx.moveTo(peakPosition.x, peakPosition.y);
    // ctx.lineTo(base.x, base.y);
    ctx.bezierCurveTo(base.x, base.y, controlPoint2.x, controlPoint2.y, baseEnd2.x, baseEnd2.y);
    // ctx.lineTo(peakPosition.x, peakPosition.y)
    ctx.arc(0,0, RADIUS, (thita - baseWidthDegree/2) * Math.PI / 180, (thita + baseWidthDegree/2) * Math.PI / 180, false);
    // ctx.stroke();
    // ctx.arcTo(baseEnd2.x, baseEnd2.y, baseEnd1.x, baseEnd1.y, RADIUS);
    ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, base.x, base.y, peakPosition.x, peakPosition.y);
    ctx.fill();
}