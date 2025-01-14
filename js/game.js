import { Ball } from './ball.js';
import { Bricks } from './bricks.js';
import { Collision } from './collision.js';
import { Explotion } from './explotion.js';
import { Paddle } from './paddle.js';
import { Render } from './render.js';
export class Game {
    constructor() {
        this.isGameOver = false;
        this.delay = Math.round(1000 / 80);
        this.nextTime = 0;
        this.ball = null;
        this.paddle = null;
        this.bricks = null;
        this.collision = null;
        this.timeStart = Date.now();
        this.explotions = [];
        if (Game._instance) {
            throw "Ya existe una instancia de Game";
        }
        Game._instance = this;
        this.starGame();
    }
    static get ins() {
        return this._instance;
    }
    newExplotion(brick) {
        this.explotions.push(new Explotion(brick));
    }
    gameOver() {
        this.isGameOver = true;
        this.modalShow();
    }
    starGame() {
        Game.ins.modalHide();
        Game.ins.timeStart = Date.now();
        Game.ins.isGameOver = false;
        Game.ins.ball = new Ball();
        Game.ins.paddle = new Paddle();
        Game.ins.bricks = new Bricks(Game.ins.getRandomNum(5, 8), Game.ins.getRandomNum(7, 10));
        Game.ins.collision = new Collision();
        Game.ins.explotions = [];
        window.requestAnimationFrame(Game.ins.frameLoop);
    }
    drawBoard() {
        Render.ins.clean();
        if (this.paddle)
            this.paddle.update();
        if (this.ball)
            this.ball.update();
        this.explotions.forEach(exp => exp.update());
        if (this.collision)
            this.collision.eval();
        if (this.ball)
            this.ball.draw();
        if (this.paddle)
            this.paddle.draw();
        if (this.bricks)
            this.bricks.draw();
        this.explotions.forEach(exp => exp.draw());
    }
    frameLoop(time) {
        if (time < Game.ins.nextTime) {
            window.requestAnimationFrame(Game.ins.frameLoop);
            return;
        }
        Game.ins.nextTime = time + Game.ins.delay;
        Game.ins.drawBoard();
        if (Game.ins.isGameOver == false) {
            requestAnimationFrame(Game.ins.frameLoop);
        }
    }
    modalHide() {
        let modalElm = document.getElementById('modal');
        if (modalElm)
            modalElm.classList.add('hidden');
    }
    modalShow() {
        let timeEnd = Date.now();
        let timeElapsed = (timeEnd - this.timeStart) * 10;
        let DateTime = new Date(timeElapsed);
        let hour = (DateTime.getUTCHours().toString().length < 2) ? "0" + DateTime.getUTCHours().toString() : DateTime.getUTCHours().toString();
        let minutes = (DateTime.getUTCMinutes().toString().length < 2) ? "0" + DateTime.getUTCMinutes().toString() : DateTime.getUTCMinutes().toString();
        let seconds = (DateTime.getUTCSeconds().toString().length < 2) ? "0" + DateTime.getUTCSeconds().toString() : DateTime.getUTCSeconds().toString();
        let modalElm = document.getElementById('modal');
        let scoreElm = document.getElementById('score');
        let bricksDestroyElm = document.getElementById('bricksDestroy');
        let bricksLeftElm = document.getElementById('bricksLeft');
        let timeElm = document.getElementById('time');
        let bricksDestroy = 0;
        let bricksLeft = 0;
        if (this.bricks && this.bricks.list) {
            bricksDestroy = (this.bricks.list.filter((brick) => brick.status == 0)).length;
            bricksLeft = (this.bricks.list.filter((brick) => brick.status > 0)).length;
        }
        let score = (bricksDestroy * 60) - (timeElapsed / 1000);
        score = (score < 0) ? 0 : score;
        if (modalElm)
            modalElm.classList.remove('hidden');
        if (scoreElm)
            scoreElm.innerText = "" + score.toFixed(0);
        if (bricksDestroyElm)
            bricksDestroyElm.innerText = "" + bricksDestroy;
        if (bricksLeftElm)
            bricksLeftElm.innerText = "" + bricksLeft;
        if (timeElm)
            timeElm.innerText = hour + ":" + minutes + ":" + seconds;
    }
    getRandomNum(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
//# sourceMappingURL=game.js.map