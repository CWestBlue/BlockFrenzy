import { Component, OnInit, HostListener } from '@angular/core';
import { NavController } from 'ionic-angular';
import {GameAreaObject, ObjectComponent } from '2d-gaming'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 gameArea: GameAreaObject;
    player: ObjectComponent;
    playerStand: ObjectComponent;
    topBlock: ObjectComponent;
    areaProp: any;
    arrow: ObjectComponent;
    rightBlock: ObjectComponent;
    arrows: ObjectComponent[] = [];
    moveArc: any;
    travel: boolean = false;
    ex: any;
    ey: any;
    @HostListener('document:touchmove', ['$event'])
    ontouchmove(e: TouchEvent) {
        this.touch(e);
    }
  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
        this.gameArea = new GameAreaObject('arrowMan', '100%', '96%');
        this.gameArea.doEveryFrame = (() => this.updateGameArea())
        this.gameArea.canvas.ontouchend = (e) => this.touch(e);
        this.gameArea.canvas.style.backgroundColor = 'black';
        this.gameArea.canvas.height = screen.height;
        this.gameArea.canvas.width = screen.width;
        this.player = new ObjectComponent(this.gameArea, 20, 20, "black", 0, this.gameArea.canvas.height / 2 - 20, 'color');
        this.playerStand = new ObjectComponent(this.gameArea, 30, 10, 'royalblue', 0, this.gameArea.canvas.height / 2, 'color');
        this.player.add(this.playerStand);
        this.topBlock = new ObjectComponent(this.gameArea, 10, 30, 'royalblue', this.gameArea.canvas.width / 2, 0, 'color')
        this.topBlock.gravity = 0;
        this.arrow = new ObjectComponent(this.gameArea, 10, 10, 'black', 0, 0, 'color')
        this.rightBlock = new ObjectComponent(this.gameArea, 30, 10, 'royalblue', this.gameArea.canvas.width - 30, this.gameArea.canvas.height / 2 - 20, 'color')
        this.playerStand.gravity = 0;
        this.rightBlock.gravity = 0;
        const button = document.createElement('button');
        button.innerText = 'start';
        button.className = "col-xs-offset-5";
        button.onclick = (e) => this.gameArea.start();
        button.style.marginRight = '3px';
        this.gameArea.area.appendChild(button);
        this.gameArea.area.style.height = '100%'
        console.log(this.gameArea.gameObjects);

    }

    start() {
        this.gameArea.interval = setInterval(() => { this.updateGameArea() }, 20);
    }
    touch(e: TouchEvent) {
        let x = e.changedTouches[0].clientX - this.gameArea.canvas.getBoundingClientRect().left
        let y = e.changedTouches[0].clientY - this.gameArea.canvas.getBoundingClientRect().top
        this.shoot(x, y, this.player);
        this.shoot(x, y, this.topBlock);
        this.shoot(x, y, this.rightBlock);
    }
    updateGameArea() {
        let colorM = Math.floor(Math.random() * 4) + 1;
        let color: string;
        switch(colorM) {
            case 1: color = 'blue'; break;
            case 2: color = 'green'; break;
            case 3: color = 'purple'; break;
            case 4: color = 'turquoise'; break;
        }
        this.arrow.color = color;
        this.gameArea.clear();
        this.gameArea.frame += 1;
        this.playerStand.update(false);
        this.topBlock.update(false);
        this.rightBlock.update(false);
        if (this.player.crashWith(this.playerStand)) {
            this.player.y = this.playerStand.y - 20;
            this.player.gravity = 0;
        } else {
            this.player.gravity = this.gameArea.gravity;
        }
        this.player.update(true);
    }
    shoot(x, y, object: ObjectComponent) { 
        object.shoot(x, y, 2, this.arrow)
        object.bullets.forEach(res => {
            res.path = {
                x: x,
                y: y,
                speed: 2
            }
        })
    }

}
