import * as PIXI from 'pixi.js';

import GameView from './GameView';
import UIUtils from '../utils/UIUtils';
import Utils from '../utils/Utils';
import Vector3 from '../gameObject/Vector3';

export default class LightSource extends GameView {
    constructor(gameObject) {
        super(gameObject);
        this.view = new PIXI.Sprite.from('small-blur')
        this.view.anchor.set(0.5)
        this.view.blendMode = PIXI.BLEND_MODES.OVERLAY

        this.lightData = {
            radius: 100,
            radius2: 100,
            minFadeDistance: 100,
            maxFadeDistance: 150,
            angle1: 0,
            angle2: Math.PI / 2,

            coneAngle: 0.1,
            coneDistance: 10
        }
        this.setRadius(100)

        this.counffff = 10

        this.targetAngle = 0;

        console.log("DRAW LIGHT")

    }
    setArc(radius, distance, angle1 = 0, angle2 = Math.PI / 2) {
        this.lightData.radius = radius;
        this.lightData.distance = distance;
        this.lightData.angle1 = angle1;
        this.lightData.angle2 = angle2;
        this.lightData.minDistance = this.lightData.radius
        this.lightData.maxDistance = this.lightData.radius * 3
        this.view.width = radius * 2
        this.view.height = radius * 1.5

        this.targetAngle = 0//this.gameObject.parent.latestAngle;

    }
    setRadius(radius) {
        this.lightData.radius = radius;
        this.lightData.minDistance = this.lightData.radius
        this.lightData.maxDistance = this.lightData.radius * 1.5
        this.view.width = radius * 2
        this.view.height = radius * 1.5


        this.setArc(50, 200, Math.PI * 0.25, Math.PI * 0.75)


        //         // Define the arc parameters
        // const x = 0;
        // const y = 0;
        // const r = 10;
        // const angle1 = 0;
        // const angle2 = Math.PI / 2;

        // // Define the point coordinates to check the distance
        // const pointX = 5;
        // const pointY = 5;

        // // Calculate the midpoint angle
        // const midAngle = (angle1 + angle2) / 2;

        // // Calculate the midpoint coordinates
        // const midX = x + r * Math.cos(midAngle);
        // const midY = y + r * Math.sin(midAngle);

        // // Calculate the distance between the point and the midpoint
        // const distance = Math.sqrt((pointX - midX) ** 2 + (pointY - midY) ** 2);

        // console.log(distance); // Output: 7.0710678118654755

    }
    getDistanceFrom(position) {

        // const midAngle = (this.lightData.angle1 + this.lightData.angle2) / 2;

        // // Calculate the midpoint coordinates
        // const midX = this.gameObject.transform.position.x + this.lightData.radius * Math.cos(midAngle);
        // const midY = this.gameObject.transform.position.z + this.lightData.radius2 * Math.sin(midAngle);

        // return Math.sqrt((position.x - midX) ** 2 + (position.z - midY) ** 2);

        // Define the center point, radius, and angle of the arc
        const centerX = this.gameObject.transform.position.x// + Math.cos(this.gameObject.parent.latestAngle) * 150;
        const centerY = this.gameObject.transform.position.z//+ Math.sin(this.gameObject.parent.latestAngle) * 150;
        const pointX = position.x;
        const pointY = position.z;
        const radius = 200;


        var startAngle =  this.targetAngle - Math.PI * 0.25
        var endAngle =  this.targetAngle + Math.PI * 0.25//this.lightData.angle2; // in radians

        
        // Calculate the angle between the point and the center of the arc
        var angle = Math.atan2(pointY - centerY, pointX - centerX);
        
        
        // Check if the point is inside the arc
        let insideArc = false;
        
        if (startAngle < endAngle) {
            insideArc = angle >= startAngle && angle <= endAngle;
        } else {
            insideArc = angle >= startAngle || angle <= endAngle;
        }
        
        if(!insideArc){
            if(angle < 0){
                angle += Math.PI * 2;            
            }
            if(startAngle < 0 || endAngle < 0){
                startAngle += Math.PI *2   
                endAngle += Math.PI *2   
            }
            if (startAngle < endAngle) {
                insideArc = angle >= startAngle && angle <= endAngle;
            } else {
                insideArc = angle >= startAngle || angle <= endAngle;
            }
        }

        // Calculate the distance from the point to the center of the arc
        const dx = pointX - centerX;
        const dy = pointY - centerY;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        // Calculate the distance from the point to the closest point on the arc
        let distanceToArc;

        //insideArc = false
        if (insideArc) {
            distanceToArc = distanceToCenter - this.lightData.distance;
        } else {
            //const rad = radius / distanceToArc;
            const startDX = centerX + radius * Math.cos(startAngle) - pointX;
            const startDY = centerY + radius * Math.sin(startAngle) - pointY;
            const startDistance = Math.sqrt(startDX * startDX + startDY * startDY);
            const endDX = centerX + radius * Math.cos(endAngle) - pointX;
            const endDY = centerY + radius * Math.sin(endAngle) - pointY;



            const endDistance = Math.sqrt(endDX * endDX + endDY * endDY);
            distanceToArc = 1000//Math.min(startDistance, endDistance) 

        }

        return distanceToArc

    }

    distanceToLine(x1, y1, x2, y2, x0, y0) {
        const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
        const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
        return numerator / denominator;
    }

    setColor(color = 0xFFFED9, intensity = 0.5) {
        this.view.tint = color
        this.view.alpha = intensity
    }

    update(delta) {
        super.update(delta);        
        this.targetAngle = Utils.angleLerp(this.targetAngle, this.gameObject.parent.latestAngle, 0.5)
        this.targetAngle %= Math.PI * 2
    }

    onRender() {
        super.onRender();

    }
}