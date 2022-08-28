"use strict";

//캔버스 세팅 
let canvas = document.createElement("canvas");  
let ctx = canvas.getContext("2d"); 
canvas.width = 400;     
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundimg, spaceshipimg, virusimg, gameoverimg, bulletimg;
let gameOver = false // 만약 true 이면 게임이 끝나게 만듬.

let score = 0;

//우주선 좌표
let spaceshipX = canvas.width / 2 - 24;
let spaceshipY = canvas.height - 48;

function loadimg() {
    backgroundimg = new Image();
    backgroundimg.src = "./img/space.png"

    spaceshipimg = new Image();
    spaceshipimg.src = "./img/battleship.png"

    virusimg = new Image();
    virusimg.src = "./img/virus.png"

    gameoverimg = new Image();
    gameoverimg.src = "./img/gameover2.png";

    bulletimg = new Image();
    bulletimg.src = "./img/bullet.png"
}

// 방향키로 캐릭터 이동 기능
let keysdown = {};
function keyboardListener() {
    document.addEventListener("keydown", function (event) {
        keysdown[event.keyCode] = true;
    });

    document.addEventListener("keyup", function (event) {
        delete keysdown[event.keyCode];
        if (event.keyCode == 32) { 
            createBullet();
        };
    });
}

//적군
function RandomValue(min,max) {
    let randomNum = Math.floor(Math.random()*(max - min+1)) + min;
    return randomNum;
}

let enemyList = [];

function Enemy() {
    this.x = 0;   //처음 값을 모르기 때문에 0으로 설정
    this.y = 0;
    this.init = function() {
        this.y = 0;
        this.x = RandomValue(0, canvas.width-60);
        enemyList.push(this);
    };
    this.update = function() {
        this.y += 5;

        if(this.y >= canvas.height - 60) {
            gameOver = true;
        }
    }
}

function createEnemy() {
    const interval = setInterval(function() {
        let e = new Enemy();
        e.init();
    },1000);
}

//총알
let bulletList = []
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceshipX + 12;
        this.y = spaceshipY;
        this.alive = true;
        bulletList.push(this)
    };
    this.update = function () {
        this.y -= 7;
    }
    this.checkHit = function() {
        for(let i=0; i < enemyList.length; i++) {
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40) {
                score++;
                this.alive = false;
                enemyList.splice(i,1);
            }
        }
    }

}

//총알 만들기
function createBullet() {
    let b = new Bullet();
    b.init();
}

//방향키로 캐릭터 이동하기
function update() {
    //우주선 행동 범위
    if (spaceshipX <= 0) {
        spaceshipX = 0;
    }
    if (spaceshipX >= canvas.width - 48) {
        spaceshipX = canvas.width - 48
    }
    if (spaceshipY <= 0) {
        spaceshipY = 0;
    }
    if (spaceshipY >= canvas.height - 48) {
        spaceshipY = canvas.height - 48
    }

    //우주선 움직이기
    if (39 in keysdown) {
        spaceshipX += 4;
    } //right
    if (37 in keysdown) {
        spaceshipX -= 4;
    }//left
    if (38 in keysdown) {
        spaceshipY -= 4;
    }//up
    if (40 in keysdown) {
        spaceshipY += 4;
    }

    //총알의 y좌표 업데이트
    for (let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    //적군 y좌표 업데이트
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
}

//render
function render() {
    ctx.drawImage(backgroundimg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipimg, spaceshipX, spaceshipY);
    ctx.fillText(`Score: ${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for (let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            ctx.drawImage(bulletimg, bulletList[i].x, bulletList[i].y)
        }
    }

    for (let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(virusimg, enemyList[i].x, enemyList[i].y);
    }
}

function main() {
    if(!gameOver) {
        update();
        render();
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverimg, 10,100,380,380);
    }
}

loadimg();
keyboardListener();
createEnemy();
main();