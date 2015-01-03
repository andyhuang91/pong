document.addEventListener('DOMContentLoaded', function(){
  new Game();
});

var settings = {
  bindings: {}
}

function Game() {
  var canvas = document.getElementById('game-canvas');
  
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.ctx.fillStyle = 'white';

  this.player1 = new Entity(100, 200, 60, 15);
  this.ball = new Ball(300, 200, 10, new Vector(1,0));

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

function Entity(xPos, yPos, height, width) {
  this.position = new Vector(xPos, yPos);
  this.height = height;
  this.width = width;
  this.velocity = new Vector(0, 0);
  this.maxSpeed = 10;
}

Entity.prototype.move = function() {
  if (this.velocity.getMagnitude() > 0) {
    this.position.x += this.velocity.x * this.maxSpeed;
    this.position.y += this.velocity.y * this.maxSpeed;
  }
}

Entity.prototype.draw = function(ctx) {
  var pos = this.position;
  ctx.fillRect(pos.x - this.width/2, pos.y - this.height/2, this.width, this.height);
}

Entity.prototype.getBoundingBox = function() {
  var halfHeight = this.height/2,
      halfWidth = this.width/2;

  var boundingBox = {
    top: this.position.y - halfHeight,
    bottom: this.position.y + halfHeight,
    left: this.position.x - halfWidth,
    right: this.position.x + halfWidth
  };

  return boundingBox;
}

Entity.prototype.checkCollision = function(entity) {
  var myBB = this.getBoundingBox(),
      otherBB = entity.getBoundingBox();

  return !(myBB.left > otherBB.right ||
          myBB.right < otherBB.left ||
          myBB.top > otherBB.bottom ||
          myBB.bottom < otherBB.top);
}

function Ball(xPos, yPos, radius, initialVelocity) {
  Entity.call(this, xPos, yPos, radius, radius);
  this.velocity = initialVelocity;
}

Ball.prototype = Object.create(Entity.prototype);

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.getMagnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.normalize = function() {
  var magnitude = this.getMagnitude();

  if(magnitude !== 0) {
    this.x = this.x / magnitude;
    this.y = this.y / magnitude;
  }
}