document.addEventListener('DOMContentLoaded', function(){
  configureSettings();
  new Game();
});

var KEY_CODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

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

  this.inputBuffer = {};

  canvas.addEventListener('keydown', onKeyDown.bind(this));
  canvas.addEventListener('keyup', onKeyUp.bind(this));

  window.setInterval(this.updateState.bind(this), 33);
}

Game.prototype.updateState = function() {
  var newVelocity = new Vector(0, 0);

  if (this.inputBuffer.moveUp) newVelocity.y = -1;
  if (this.inputBuffer.moveDown) newVelocity.y = 1;
  if (this.inputBuffer.moveLeft) newVelocity.x = -1;
  if (this.inputBuffer.moveRight) newVelocity.x = 1;
  
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

function configureSettings() {
  window.settings.bindings[KEY_CODES.UP] = 'moveUp';
  window.settings.bindings[KEY_CODES.DOWN] = 'moveDown';
  window.settings.bindings[KEY_CODES.LEFT] = 'moveLeft';
  window.settings.bindings[KEY_CODES.RIGHT] = 'moveRight';
}

function onKeyDown(event) {
  event.preventDefault();
  var action = window.settings.bindings[event.keyCode];
  if (action) {
    this.inputBuffer[action] = true;
  }
}

function onKeyUp(event) {
  event.preventDefault();
  var action = window.settings.bindings[event.keyCode];
  if (action) {
    this.inputBuffer[action] = false;
  }
}