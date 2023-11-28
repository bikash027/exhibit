const ns = "http://www.w3.org/2000/svg";
const squares = new Map();

for(let i=0; i<1000; i+=10){
    for(let j=0; j<1000; j+=10){
        const key = {
            top: j,
            left: i,
        }
        const value = {
            bottom: j+10,
            right: i+10
        }
        squares.set(JSON.stringify(key), value);
    }
}

let maxSize = 10;

for(let i=0; i<2000; i++){
    const randomTop = Math.round(Math.random()*(100 - maxSize/10))*10;
    const randomLeft = Math.round(Math.random()*(100 - maxSize/10))*10;
    const key = {
        top: randomTop,
        left: randomLeft
    }
    const squareFound = squares.get(JSON.stringify(key))
    if(!squareFound)
        continue;
    const nextSquareKey = {
        top: squareFound.bottom,
        left: squareFound.right
    }
    const nextSquare = squares.get(JSON.stringify(nextSquareKey));
    if(!nextSquare)
        continue;
    const squaresToDelete = [];
    for(let j = key.top; j<nextSquare.bottom; j+=10){
        for(let k = key.left; k<nextSquare.right; k+=10){
            const squareToDelete = {
                top: j,
                left: k
            }
            if(squares.get(JSON.stringify(squareToDelete)))
                squaresToDelete.push(squareToDelete);
        }
    }
    if(squaresToDelete.length === 0 || squaresToDelete.length%2 !== 0)
        continue;
    for(const square of squaresToDelete){
        squares.delete(JSON.stringify(square));
    }
    if(maxSize < nextSquare.bottom - key.top){
        maxSize = nextSquare.bottom - key.top;
    }
    squares.set(JSON.stringify(key), nextSquare);
}


const svgElement = document.getElementById('svg');
let displaySmallDrop = true;
for(const [key, value] of squares){
    const {top, left} = JSON.parse(key);
    const {bottom, right} = value;
    const radius = (bottom - top) / 2;
    if(radius <= 10){
        displaySmallDrop = !displaySmallDrop;
        if(!displaySmallDrop)
            continue;
        if(Math.random()*10 > 0.7)
            continue;
    }
    const newSquareElement = document.createElementNS(ns, "circle");
    // const red = Math.round(Math.random()*50)
    // const green = Math.round(Math.random()*200);
    // const blue = Math.round(Math.random()*255);
    // const color = `rgb(${red},${green},${blue})`;
    const rad = Math.pow(radius, 0.9);
    const lValue = Math.round(Math.random()*49 + 50)
    const color = `hsl(216,93%,${lValue}%)`
    newSquareElement.setAttribute("fill", color);
    newSquareElement.setAttribute("cx", left + radius);
    newSquareElement.setAttribute("cy", top + radius);
    newSquareElement.setAttribute("r", rad);
    svgElement.appendChild(newSquareElement);
}