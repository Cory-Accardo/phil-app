const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

const onSelect = (e) =>{
    const source = document.getElementById('source_input').value;
    if(source == 'quantum'){
        document.getElementById('speed_input').style.display = 'none';
        document.getElementById('direction_input').style.display = 'none';
        const hide = document.querySelectorAll(".determined");
        hide.forEach(element =>{
            element.style.visibility = 'hidden';
        })
    }
    else{
        document.getElementById('speed_input').style.display = 'inline-block';
        document.getElementById('direction_input').style.display = 'inline-block';
        const show = document.querySelectorAll(".determined");
        show.forEach(element =>{
            element.style.visibility = 'visible';
        })
    }

}

const buttonOnClick = (e) => {
    const source = document.getElementById('source_input').value;
    const color = document.getElementById('color_input').value;
    if(source == 'quantum'){
        fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16')
        .then(response => response.json())
        .then(data => {
            const speed = data.data[0] % 15;
            const direction = data.data[0] % 359;
            new Ball(canvas.width/2, canvas.height/2, 2, direction, speed, color);
        }).catch(error => alert(error));
    }
    else{
        const speed = document.getElementById('speed_input').value;
        const direction = document.getElementById('direction_input').value;
        new Ball(canvas.width/2, canvas.height/2, 2, direction, speed, color);
    }
}

class Ball {
    constructor(x, y, r, dir, speed, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dir = dir;
        this.color = color;
        this.speed = speed + 1;
        this.id = Ball.instances.length;
        Ball.instances.push(this);
    }
    static instances = [];
    static clearInstances(){
        Ball.instances = [];
    }
    drawBall(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
    }
    moveBall(){
        this.x += Math.sin(this.dir) * this.speed;
        this.y += Math.cos(this.dir) * this.speed;
    }
    get isCollide(){

        if(this.x + this.r >= canvas.width){
            return true;
        }
        if(this.x - this.r <= 0){
            return true;
        }
        if(this.y + this.r >= canvas.height){
            return true;
        }
        if(this.y -this.r <= 0){
            return true;
        }
        Ball.instances.forEach(other_ball => {
            if((Math.abs(other_ball.x - this.x) <= this.r) && (Math.abs(other_ball.y - this.y) <= this.r) && other_ball.id != this.id){
                this.dir = (this.dir + 180) % 359;
                other_ball.dir = (other_ball.dir + 180) % 359; 
                }
        })
        return false;
    }
}


const updateRender = () =>{
    drawRect(0, 0, canvas.width, canvas.height, "#0c0c0c2c");
    Ball.instances.forEach(ball => {
        ball.moveBall();
        ball.drawBall();
        if(ball.isCollide){
            ball.dir = (ball.dir + 180) % 359;
        }
    })
}

let framePerSecond = 60;

setInterval(updateRender, 1000/framePerSecond);
