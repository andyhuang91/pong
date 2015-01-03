var settings = {
  paddle: {
    height: 60,
    width: 15
  },
  ball: {
    radius: 10
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

function Player(xPos, yPos) {
  Entity.call(this, xPos, yPos, settings.paddle.height, settings.paddle.width)
}

Player.prototype = Object.create(Entity.prototype);

function Ball(xPos, yPos, initialVelocity) {
  Entity.call(this, xPos, yPos, settings.ball.radius, settings.ball.radius);
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