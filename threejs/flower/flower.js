import * as THREE from 'three';

export class Flower{
    growDuration = 2;
    bloomDuration = 8;
    shedDuration = 6;
    constructor({position, color, spawnTime}){
        this.spawnTime = spawnTime;
        this.ringsInitial = {
            first: {y: 0.25, radius: 0.05},
            second: {y: 0.5, radius: 0.1},
            third: {y: 0.75, radius: 0.1},
            fourth: {y: 1, radius: 0.01},
        }
        this.turnDegInitial = 15;
        this.colorInitial = {
            h: 348/360,
            s: color == 'pink'? 0.79: 0,
            l: color == 'pink'? 0.81: 1
        }
        this.scaleInitial = 0.1;
        this.ringsBloomed = {
            first: {y: 0.25, radius: 0.05},
            second: {y: 0.5, radius: 0.25},
            third: {y: 0.5, radius: 0.75},
            fourth: {y: 0.25, radius: 1},
        }
        this.turnDegFinal = 0;
        this.scaleBloomed = 1;
        this.colorFinal = {
            h: 348/360,
            s: 0.10,
            l: 0.20
        }
        this.scaleShed = 0.1;
        this.petalGeometry = new THREE.BufferGeometry();
        this.numPetals = 6;
        this.numVertices =  this.numPetals *  (2*4 + 3); // 2 quadtrilaterals, 1 triangle
        const positionNumComponents = 3;
        this.positions = new Float32Array(this.numVertices * positionNumComponents);
        this.calcPetalPositions({
            rings: this.ringsInitial,
            turnDeg: this.turnDegInitial
        });
        this.positionAttribute = new THREE.BufferAttribute(this.positions, positionNumComponents);
        this.positionAttribute.setUsage(THREE.DynamicDrawUsage);
        this.petalGeometry.setAttribute('position', this.positionAttribute);
        const indices = this.getIndices();
        this.petalGeometry.setIndex(indices);
        this.petalGeometry.computeVertexNormals();
        this.flowerMaterial = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide
        });
        this.flowerMaterial.color.setHSL(this.colorInitial.h, this.colorInitial.s, this.colorInitial.l);
        const petalMesh = new THREE.Mesh(this.petalGeometry, this.flowerMaterial);

        const cone = new THREE.ConeGeometry(0.05, 0.75, 6, 1, true, Math.PI/6);
        const coneMesh  = new THREE.Mesh(cone, this.flowerMaterial);
        coneMesh.position.set(0, 0.25 + 0.75/2, 0);

        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.25, 6, 1, true, Math.PI/6);
        const stemMaterial = new THREE.MeshPhongMaterial({
            side: THREE.FrontSide,
            color: '#4a9764'
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial)
        stem.position.set(0, 0.25/2, 0);
        
        const flower = new THREE.Object3D();
        flower.add(petalMesh);
        flower.add(coneMesh);
        flower.add(stem);
        flower.scale.set(this.scaleInitial, this.scaleInitial, this.scaleInitial)
        this.object3D = flower;
        this.setPosition(position);
    }

    calcPetalPositions({rings, turnDeg}){
        const positionNumComponents = 3;
        let posNdx = 0;
        const getPoint = ({ring, outer, radialPos}) => {
            radialPos = (radialPos + 360) % 360;
            const radialPosRad = (radialPos * Math.PI)/180;
            const radius = outer
                ? ring.radius + 0.02
                : ring.radius;
            const y = outer
                ? ring.y + 0.02
                : ring.y;
            const vector = new THREE.Vector3(Math.cos(radialPosRad)*radius, y, Math.sin(radialPosRad)*radius);
            return vector.toArray();
        }
        for(let i=0; i<this.numPetals; i++){
            const radialPosLeft = (i*360)/this.numPetals;
            const radialPosRight = ((i+1)*360)/this.numPetals;
            // quad between first and second rings
            //// first ring 
            const point0 = getPoint({
                ring: rings.first,
                outer: false,
                radialPos: radialPosLeft
            })
            this.positions.set(point0, posNdx);
            posNdx += positionNumComponents;
            const point1 = getPoint({
                ring: rings.first,
                outer: false,
                radialPos: radialPosRight
            })
            this.positions.set(point1, posNdx);
            posNdx += positionNumComponents;
            //// second ring
            const point2 = getPoint({
                ring: rings.second,
                outer: false,
                radialPos: radialPosLeft - turnDeg
            })
            this.positions.set(point2, posNdx);
            posNdx += positionNumComponents;
            const point3 = getPoint({
                ring: rings.second,
                outer: true,
                radialPos: radialPosRight - turnDeg
            })
            this.positions.set(point3, posNdx);
            posNdx += positionNumComponents;
    
            // quad between second and third rings
            //// second ring
            this.positions.set(point2, posNdx);
            posNdx += positionNumComponents;
            this.positions.set(point3, posNdx);
            posNdx += positionNumComponents;
            //// third ring
            const point4 = getPoint({
                ring: rings.third,
                outer: false,
                radialPos: radialPosLeft - 2*turnDeg
            });
            this.positions.set(point4, posNdx);
            posNdx += positionNumComponents;
            const point5 = getPoint({
                ring: rings.third,
                outer: true,
                radialPos: radialPosRight - 2*turnDeg
            });
            this.positions.set(point5, posNdx);
            posNdx += positionNumComponents;
    
            // triangle between third and fourth rings
            //// third ring
            this.positions.set(point4, posNdx);
            posNdx += positionNumComponents;
            this.positions.set(point5, posNdx);
            posNdx += positionNumComponents;
            //// fourth ring
            const point6 = getPoint({
                ring: rings.fourth,
                outer: false,
                radialPos: (radialPosLeft + radialPosRight)/2 - 3*turnDeg,
            })
            this.positions.set(point6, posNdx);
            posNdx += positionNumComponents;
        }
    }
    getIndices(){
        const indices = [];
        let ndx = 0;
        for(let i=0; i<this.numPetals; i++){
            indices.push(
                // quad between first and second ring
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3,
                // quad between second and third ring
                ndx + 4, ndx + 5, ndx + 6,
                ndx + 6, ndx + 5, ndx + 7,
                // triangle between third and fourth ring
                ndx + 8, ndx + 9, ndx + 10
            )
            ndx += 11;
        }
        return indices;
    }

    setPosition(position){
        this.object3D.position.set(
            position.x,
            0,
            position.z
        )
    }

    addToScene(scene){
        scene.add(this.object3D);
    }

    isShed(time){
        if(this._shed)
            return true;
        if(time - this.spawnTime > this.growDuration + this.bloomDuration + this.shedDuration)
            return true;
        return false;
    }

    update(time){
        const timeSpent = time - this.spawnTime;
        if(timeSpent < this.growDuration){
            const progress = timeSpent / this.growDuration;
            const scale = THREE.MathUtils.lerp(this.scaleInitial, this.scaleBloomed, progress);
            this.object3D.scale.set(scale, scale, scale);

        } else if(
            this.growDuration < timeSpent &&
            timeSpent < this.growDuration + this.bloomDuration
        ){
            const progress = (timeSpent - this.growDuration)/ this.bloomDuration;
            const rings = {}
            Object.keys(this.ringsInitial).forEach((key) => {
                rings[key] = {
                    y: THREE.MathUtils.lerp(this.ringsInitial[key].y, this.ringsBloomed[key].y, progress),
                    radius: THREE.MathUtils.damp(this.ringsInitial[key].radius, this.ringsBloomed[key].radius, 10, progress)
                }
            })
            const turnDeg = THREE.MathUtils.damp(this.turnDegInitial, this.turnDegFinal, 10, progress);
            this.calcPetalPositions({
                rings,
                turnDeg
            })
            this.positionAttribute.needsUpdate = true;
            this.petalGeometry.computeVertexNormals();
        } else if(
            this.growDuration + this.bloomDuration < timeSpent &&
            timeSpent < this.growDuration + this.bloomDuration + this.shedDuration
        ){
            const progress = (timeSpent - this.growDuration - this.bloomDuration) / this.shedDuration;
            const saturation = THREE.MathUtils.lerp(this.colorInitial.s, this.colorFinal.s, progress);
            const lightness = THREE.MathUtils.lerp(this.colorInitial.l, this.colorFinal.l, progress);
            this.flowerMaterial.color.setHSL(this.colorInitial.h, saturation, lightness);
            const scale = THREE.MathUtils.lerp(this.scaleBloomed, this.scaleShed, progress);
            this.object3D.scale.set(scale, scale, scale);
        } else {
            this.object3D.removeFromParent();
            this._shed = true;
        }
    }
}