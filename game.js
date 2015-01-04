document.addEventListener('DOMContentLoaded', function(){
  new Game();
});

function Game() {
  var canvas = document.getElementById('game-canvas')
      ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '40px "Helvetica", sans-serif';
  this.ctx = ctx;

  this.width = canvas.width;
  this.height = canvas.height;


  this.ball = new Ball(300, 200, new Vector(-0.5,1));
  this.players = [new Player(100, 200),
                  new Player(500, 200)];

  this.inputEngine = new InputEngine(canvas);
  this.render();

  canvas.addEventListener('focus', this.startGame.bind(this));
  canvas.addEventListener('blur', this.stopGame.bind(this));
}

Game.prototype.startGame = function() {
  this.intervalId = window.setInterval(this.updateState.bind(this), 33);
}

Game.prototype.stopGame = function() {
  if (this.intervalId) window.clearInterval(this.intervalId);
}

Game.prototype.updateState = function() {
  var actions = this.inputEngine.actions;

  this.ball.move();
  this.players.forEach(function(player, index) {
    this.updatePlayerVelocity(player, actions['player' + (index + 1)]);
    this.checkPaddleCollision(player);
    player.move();
  }, this);

  this.checkWallCollisions();
  this.checkScore();
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
  this.ctx.fillText(this.getScore(), 300, 50);
}

Game.prototype.checkWallCollisions = function() {
  var ballPos = this.ball.position,
      ballVel = this.ball.velocity;

  if (ballPos.y < 0) {
    ballVel.y = Math.abs(ballVel.x);
  } else if (ballPos.y > this.height) {
    ballVel.y = -Math.abs(ballVel.y);
  }

  this.players.forEach(function(player, index) {
    var bb = player.getBoundingBox(),
        pos = player.position,
        halfHeight = player.height/2;

    if (bb.top < 0) pos.y = halfHeight;
    if (bb.bottom > this.height) pos.y = this.height - halfHeight;
  }, this);
}

Game.prototype.checkPaddleCollision = function(player) {
  var paddleCollision = this.ball.checkCollision(player);

  if (paddleCollision) {
    var newXDirection = (this.ball.position.x > player.position.x) ? 1 : -1;
    this.ball.velocity.x =  newXDirection * Math.abs(this.ball.velocity.x);
  }
}

Game.prototype.checkScore = function() {
  var ballPos = this.ball.position;

  if (ballPos.x < 0) {
    this.awardPoints(this.players[1]);
  } else if (ballPos.x > this.width) {
    this.awardPoints(this.players[0]);
  }
}

Game.prototype.awardPoints = function(player) {
  player.points++;
  this.stopGame();

  this.ball.position = new Vector(300, 200);
  this.ball.velocity.x = -this.ball.velocity.x;
  this.render();

  window.setTimeout(this.startGame.bind(this), 500);
}

Game.prototype.getScore = function() {
  var pointsArray = this.players.map(function(player) {
    return player.points;
  })
  return pointsArray.join(' - ');
}