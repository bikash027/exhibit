const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 500;
const HEIGHT = 500;
const WHITE = '#FFF';
const BLUE = '#5BCEFA';
const RADIUS = 200;
const START = -200;
const END = 200;
const STEPS = 128;
const stepSize = (END - START) / STEPS;


ctx.translate(WIDTH/2, HEIGHT/2);
ctx.scale(1, -1);

// ctx.lineWidth = 2
// ctx.moveTo(RADIUS/3,0);
// ctx.arc(0, 0, RADIUS/3, 0, Math.PI * 2, true);
// ctx.fillStyle = BLUE;
// ctx.fill();
// ctx.strokeStyle = WHITE;
ctx.fillStyle = WHITE;
const toCartesian = ({radius, degree, center}) => {
    center.x = center.x?? 0;
    center.y = center.y?? 0;
    return {
        x: center.x + radius * Math.cos(degree * Math.PI / 180),
        y: center.y + radius * Math.sin(degree * Math.PI / 180)
    }
}

// for(let thita = 0; thita < 360; thita+=1){
//     const drawSpike = Math.floor(Math.random() + 0.5) == 0? false: true;
//     if(!drawSpike)
//         continue;
//     ctx.beginPath()
//     const spikeDepth = RADIUS/3 + Math.random() * (1 * RADIUS / 3);
//     const peakPosition = toCartesian({
//         radius: spikeDepth,
//         degree:  thita
//     })
//     const base = toCartesian({
//         radius: RADIUS,
//         degree: thita
//     })
//     const baseWidthDegree = 12;
//     const baseEnd1 = toCartesian({
//         radius: RADIUS,
//         degree: thita + baseWidthDegree/2
//     });
//     const baseEnd2 = toCartesian({
//         radius: RADIUS,
//         degree: thita - baseWidthDegree/2
//     })
//     const controlPoint1 = toCartesian({
//         radius: RADIUS,
//         degree: thita + baseWidthDegree/4
//     });
//     const controlPoint2 = toCartesian({
//         radius: RADIUS,
//         degree: thita - baseWidthDegree/4
//     })

//     ctx.moveTo(peakPosition.x, peakPosition.y);
//     // ctx.lineTo(base.x, base.y);
//     ctx.bezierCurveTo(base.x, base.y, controlPoint2.x, controlPoint2.y, baseEnd2.x, baseEnd2.y);
//     // ctx.lineTo(peakPosition.x, peakPosition.y)
//     ctx.arc(0,0, RADIUS, (thita - baseWidthDegree/2) * Math.PI / 180, (thita + baseWidthDegree/2) * Math.PI / 180, false);
//     // ctx.stroke();
//     // ctx.arcTo(baseEnd2.x, baseEnd2.y, baseEnd1.x, baseEnd1.y, RADIUS);
//     ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, base.x, base.y, peakPosition.x, peakPosition.y);
//     ctx.fill();
// }

const gray = (decimal) => {
    return decimal ^ (Math.floor(decimal/2));
}
// const biggestArc = gray(STEPS/2) - gray(STEPS/2 - 1);
// const biggestArcTime = biggestArc * 20;
const speed = 1 / 8; // unit distance per ms
const grayCodes = [];
grayCodes.push({
    code: 0,
    currentTurn: 0,
    orientation: 'down',
});
for(let i=1; i<STEPS; i++){
    const nextCode = gray(i);
    const turns = (nextCode - grayCodes[i-1].code) / speed;
    const centerPos = stepSize * (grayCodes[i-1].code + nextCode)/2;
    const center = {
        x: START + centerPos,
        y: 0
    }
    const radius = stepSize * (nextCode - grayCodes[i-1].code)/2;
    grayCodes[i-1] = {
        ...grayCodes[i-1],
        turns: Math.floor(Math.abs(turns)),
        center,
        radius: Math.abs(radius),
        direction: nextCode > grayCodes[i-1].code? 'right': 'left'
    }
    grayCodes.push({
        code: nextCode,
        currentTurn: 0,
        orientation: i % 2 == 0? 'down': 'up'
    })
}
console.log(grayCodes);
let currentArrIndex = 0;

const render = (time) => {
    if(currentArrIndex >= STEPS - 1){
        return;
    }
    const lastStep = grayCodes[currentArrIndex];
    const {currentTurn, turns, radius, center, direction, orientation} = lastStep;
    // const nextStep = Math.ceil(time / 100);
    const progress = currentTurn / (turns == 0? 20: turns);

    // const lastStepGray = gray(lastStep);
    // const nextStepGray = gray(nextStep);
    // const centerPos = stepSize * (lastStepGray + nextStepGray)/2;
    // const center = {
    //     x: START + centerPos,
    //     y: 0
    // }
    // const radius = stepSize * (nextStepGray - lastStepGray)/2;
    let angle = progress*180;
    if(orientation == 'down' && direction == 'right'){
        angle = 180 + angle;
    } else if(orientation == 'down' && direction == 'left'){
        angle = 360 - angle;
    } else if(orientation == 'up' && direction == 'right'){
        angle = 180 - angle;
    }

    
    // const angle = lastStep.orientation === 'up'
    //     ? 180 - progressDegree
    //     : 180 + progressDegree
    const point = toCartesian({
        radius,
        degree: angle,
        center,
    })
    ctx.fillRect(point.x, point.y, 1, 1);
    lastStep.currentTurn++;
    if(lastStep.currentTurn >= turns){
        currentArrIndex++;
    }
    requestAnimationFrame(render);
}

requestAnimationFrame(render)