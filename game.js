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

  this.player1 = new Entity(300,200, 60, 15);

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
  this.player1.move();
  this.render();
}

Game.prototype.drawEntity = function(entity) {
  this.ctx.fillRect(entity.position.x - entity.width/2, entity.position.y - entity.height/2, entity.width, entity.height);
}

Game.prototype.render = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.drawEntity(this.player1);
}

function Entity(xPos, yPos, height, width, ctx) {
  this.position = new Vector(xPos, yPos);
  this.height = height;
  this.width = width;
  this.ctx = ctx;
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