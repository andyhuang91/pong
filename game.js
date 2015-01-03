document.addEventListener('DOMContentLoaded', function(){
  new Game();
});

function Game() {
  var canvas = document.getElementById('game-canvas');
  
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.ctx.fillStyle = 'white';

  this.player1 = new Player(100, 200);
  this.ball = new Ball(300, 200, new Vector(1,2));

  this.inputEngine = new InputEngine(canvas);

  window.setInterval(this.updateState.bind(this), 33);
}

Game.prototype.updateState = function() {
  var actions = this.inputEngine.actions,
      newVelocity = new Vector(0, 0);

  if (actions.moveUp) newVelocity.y = -1;
  if (actions.moveDown) newVelocity.y = 1;
  if (actions.moveLeft) newVelocity.x = -1;
  if (actions.moveRight) newVelocity.x = 1;
  
  newVelocity.normalize();
  this.player1.velocity = newVelocity;

  this.checkWallCollisions();
  this.checkPaddleCollisions();

  this.player1.move();
  this.ball.move();
  this.render();
}

Game.prototype.drawEntity = function(entity) {
  this.ctx.fillRect(entity.position.x - entity.width/2, entity.position.y - entity.height/2, entity.width, entity.height);
}

Game.prototype.render = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.drawEntity(this.player1);
  this.drawEntity(this.ball);
}

Game.prototype.checkWallCollisions = function() {
  var ballPos = this.ball.position,
      ballVel = this.ball.velocity,
      player1Pos = this.player1.position;

  if (ballPos.x < 0) {
    ballVel.x = Math.abs(ballVel.x);
  } else if (ballPos.x > this.width) {
    ballVel.x = -Math.abs(ballVel.x);
  }

  if (ballPos.y < 0) {
    ballVel.y = Math.abs(ballVel.x);
  } else if (ballPos.y > this.height) {
    ballVel.y = -Math.abs(ballVel.y);
  }
}

Game.prototype.checkPaddleCollisions = function() {
  var paddleCollision = this.ball.checkCollision(this.player1);

  if (paddleCollision) {
    var newXDirection = (this.ball.position.x > this.player1.position.x) ? 1 : -1;
    this.ball.velocity.x =  newXDirection * Math.abs(this.ball.velocity.x);
  }
}