const curveElement = document.getElementById('curve');

const center = {
    x: 250,
    y: 250
};

const coordinates = [];
const r = 180;
const initialAngle = Math.round(Math.random()*360)
const possibleNoOfPoints = [8, 9, 10, 12, 15, 18, 24, 30]
const noOfPoints = possibleNoOfPoints[Math.round(Math.random()*possibleNoOfPoints.length)];

for(let angle = initialAngle; angle < 360 + initialAngle; angle += 360/noOfPoints){
    const randomRadius = (Math.random()*0.3 + 0.7) * r;
    const point = {
        x: center.x + randomRadius*Math.cos(angle * Math.PI / 180),
        y: center.y + randomRadius*Math.sin(angle * Math.PI / 180)
    }
    coordinates.push(point);
}
const first = coordinates[0];
let d = `M ${first.x} ${first.y}`
const randomRadius = (Math.random()*0.4 + 0.6) * r;
const controlPoint1 = {
    x: center.x + randomRadius * Math.cos((initialAngle + 180/noOfPoints) * Math.PI / 180),
    y: center.y + randomRadius * Math.sin((initialAngle + 180/noOfPoints) * Math.PI / 180)
}
const controlPoints = [controlPoint1];
const nextControlPoint = (controlPoint, point) => {
    return {
        x: point.x + point.x - controlPoint.x,
        y: point.y + point.y - controlPoint.y
    }
}

for(let i = 1; i < coordinates.length; i++){
    const point = coordinates[i];
    const currentControl = controlPoints[controlPoints.length - 1];
    controlPoints.push(nextControlPoint(currentControl, point));
}

controlPoints.push(nextControlPoint(controlPoint1, first));

for(let i=1; i<coordinates.length; i++){
    const point = coordinates[i];
    const controlPoint = controlPoints[i-1];
    d += ` Q ${controlPoint.x} ${controlPoint.y}, ${point.x} ${point.y}`;
}

const cLen = controlPoints.length;
d += ` C ${controlPoints[cLen - 2].x} ${controlPoints[cLen - 2].y}, ${controlPoints[cLen - 1].x} ${controlPoints[cLen - 1].y}, ${first.x} ${first.y}`;
curveElement.setAttribute('d', d);