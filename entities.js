var settings = {
  paddle: {
    height: 60,
    width: 15
  },
  ball: {
    radius: 10
  },
  speedMultipliers: {
    ai: 0.7,
    ball: 1
  }
}

function Entity(xPos, yPos, height, width) {
  this.position = new Vector(xPos, yPos);
  this.height = height;
  this.width = width;
  this.velocity = new Vector(0, 0);
}

Entity.prototype.maxSpeed = 10;

Entity.prototype.move = function() {
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
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

Entity.prototype.setVelocityDirection = function(vector) {
  vector.normalize();
  vector.multiply(this.maxSpeed);
  this.velocity = vector;
}

function Player(xPos, yPos) {
  Entity.call(this, xPos, yPos, settings.paddle.height, settings.paddle.width);
  this.points = 0;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.processActions = function(actions) {
  var newVelocityDirection = new Vector(0, 0);

  if (actions.moveUp) newVelocityDirection.y = -1;
  if (actions.moveDown) newVelocityDirection.y = 1;
  if (actions.moveLeft) newVelocityDirection.x = -1;
  if (actions.moveRight) newVelocityDirection.x = 1;
  
  this.setVelocityDirection(newVelocityDirection);
}

function AIPlayer(xPos, yPos) {
  Player.call(this, xPos, yPos);
  this.aimNextShot()
}

AIPlayer.prototype = Object.create(Player.prototype);
AIPlayer.prototype.maxSpeed = settings.speedMultipliers.ai * Player.prototype.maxSpeed;

AIPlayer.prototype.computeActions = function(ball) {
  var dy = this.getPredictedBallPosition(ball) - this.getDesiredCollisionPos(),
      ballMovingAway = ((ball.position.x < this.position.x) && ball.velocity.x < 0 ) || 
                       ((ball.position.x > this.position.x) && ball.velocity.x > 0 );

  if (ballMovingAway) return {};

  // only move if the ball is further away than maxSpeed to prevent stuttering
  if (Math.abs(dy) > this.maxSpeed) {
    return (dy < 0) ? {moveUp: true} : {moveDown: true};
  }

  return {};
}

AIPlayer.prototype.aimNextShot = function() {
  // y-coordinate relative to the center of the paddle
  this._relDesiredCollisionPos = (Math.random() - 0.5) * this.height;
}

AIPlayer.prototype.getDesiredCollisionPos = function() {
  return this._relDesiredCollisionPos + this.position.y;
}

AIPlayer.prototype.getPredictedBallPosition = function(ball) {
  var dx = this.position.x - ball.position.x,
      dt = dx / ball.velocity.x;
  return ball.position.y + ball.velocity.y * dt;
}

function Ball(xPos, yPos, initialDirection) {
  Entity.call(this, xPos, yPos, settings.ball.radius, settings.ball.radius);
  this.setVelocityDirection(initialDirection);
}

Ball.prototype = Object.create(Entity.prototype);
Ball.prototype.maxSpeed = settings.speedMultipliers.ball * Entity.prototype.maxSpeed;

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

Vector.prototype.multiply = function(number) {
  this.x = this.x * number;
  this.y = this.y * number;
}