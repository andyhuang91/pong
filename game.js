document.addEventListener('DOMContentLoaded', function(){
  new Game();
});

function Game() {
  var canvas = document.getElementById('game-canvas');
  
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.ctx.fillStyle = 'white';

  this.players = [new Player(100, 200),
                  new Player(500, 200)];

  this.ball = new Ball(300, 200, new Vector(1,2));

  this.inputEngine = new InputEngine(canvas);
  this.startGame();
}

Game.prototype.startGame = function() {
  this.intervalId = window.setInterval(this.updateState.bind(this), 33);
}

Game.prototype.updateState = function() {
  var actions = this.inputEngine.actions;

  this.players.forEach(function(player, index) {
    this.updatePlayerVelocity(player, actions['player' + (index + 1)]);
    this.checkPaddleCollision(player);
    player.move();
  }, this);

  this.checkWallCollisions();
  this.ball.move();
  this.render();
}

Game.prototype.updatePlayerVelocity = function(player, playerActions) {
  var newVelocity = new Vector(0, 0);

  if (playerActions.moveUp) newVelocity.y = -1;
  if (playerActions.moveDown) newVelocity.y = 1;
  if (playerActions.moveLeft) newVelocity.x = -1;
  if (playerActions.moveRight) newVelocity.x = 1;
  
  newVelocity.normalize();
  player.velocity = newVelocity;
}

Game.prototype.drawEntity = function(entity) {
  this.ctx.fillRect(entity.position.x - entity.width/2, entity.position.y - entity.height/2, entity.width, entity.height);
}

Game.prototype.render = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.drawEntity(this.ball);
  this.players.forEach(function(player) {
    this.drawEntity(player);
  }, this)
}

Game.prototype.checkWallCollisions = function() {
  var ballPos = this.ball.position,
      ballVel = this.ball.velocity;

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

Game.prototype.checkPaddleCollision = function(player) {
  var paddleCollision = this.ball.checkCollision(player);

  if (paddleCollision) {
    var newXDirection = (this.ball.position.x > player.position.x) ? 1 : -1;
    this.ball.velocity.x =  newXDirection * Math.abs(this.ball.velocity.x);
  }
}