document.addEventListener('DOMContentLoaded', function(){
  new Game();
});

function Game(debugMode) {
  var canvas = document.getElementById('game-canvas')
      ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '40px "Helvetica", sans-serif';

  this.ctx = ctx;
  this.canvas = canvas;

  this.width = canvas.width;
  this.height = canvas.height;

  this.inputEngine = new InputEngine(canvas);

  // if true, renders additional AI information to the screen
  this.debugMode = debugMode || false;

  this.audio = {
    paddle: document.getElementById("paddleAudio"),
    point: document.getElementById("pointAudio"),
    wall: document.getElementById("wallAudio")
  };

  this.initializeEntities();
  this.render();

  canvas.addEventListener('focus', this.startGame.bind(this));
  canvas.addEventListener('blur', this.stopGame.bind(this));
}

Game.prototype.initializeEntities = function() {
  this.ball = new Ball(300, 200, new Vector(-0.5,1));
  this.players = [new Player(100, 200),
                  new AIPlayer(500,200)];
}

Game.prototype.startGame = function() {
  if (!this.intervalId) {
    this.intervalId = window.setInterval(this.updateState.bind(this), 33);
  }
}

Game.prototype.stopGame = function() {
  if (this.intervalId) {
    window.clearInterval(this.intervalId);  
    delete this.intervalId;
  }
}

Game.prototype.updateState = function() {
  this.ball.move();
  this.checkWallCollisions(this.ball);

  this.players.forEach(function(player, index) {
    var playerActions = (player instanceof AIPlayer) ? player.computeActions(this.ball) :
                                                       this.inputEngine.actions['player' + (index + 1)];
    player.processActions(playerActions);
    player.move();
    this.checkPaddleCollision(player);
    this.checkWallCollisions(player);
  }, this);

  this.render();

  this.checkScore();
}

Game.prototype.drawEntity = function(entity) {
  this.ctx.fillRect(entity.position.x - entity.width/2, entity.position.y - entity.height/2, entity.width, entity.height);
}

Game.prototype.render = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.drawEntity(this.ball);
  this.players.forEach(function(player) {
    this.drawEntity(player);
    if ((player instanceof AIPlayer) && this.debugMode) {
      this.drawEntity(new Entity(player.position.x, player.getDesiredCollisionPos(), 5, 50));
      this.drawEntity(new Entity(player.position.x, player.getPredictedBallPosition(this.ball), 2, 70));
    }
  }, this)
  this.ctx.fillText(this.getScore(), 300, 50);
}

Game.prototype.checkWallCollisions = function(entity) {
  var bb = entity.getBoundingBox(),
      pos = entity.position,
      halfHeight = entity.height/2,
      topCollision = bb.top < 0,
      bottomCollision = bb.bottom > this.height;

  // constrain all entities between the top and bottom walls
  if (topCollision) pos.y = halfHeight;
  if (bottomCollision) pos.y = this.height - halfHeight;

  // reflect all balls off the top and bottom walls
  if (entity instanceof Ball) {
    var ballVel = entity.velocity;
    if (topCollision) ballVel.y = Math.abs(ballVel.y);
    if (bottomCollision) ballVel.y = -Math.abs(ballVel.y);
    if (topCollision || bottomCollision) this.audio.wall.play();
  }
}

Game.prototype.checkPaddleCollision = function(player) {
  var paddleCollision = this.ball.checkCollision(player);

  if (paddleCollision) {
    var newXDirection = (this.ball.position.x > player.position.x) ? 1 : -1,
        relativeYIntersect = (this.ball.position.y - player.position.y) / (player.height / 2),
        bounceAngle = relativeYIntersect * 65 * (Math.PI / 180),
        newDirection = new Vector(newXDirection * Math.cos(bounceAngle), Math.sin(bounceAngle));
    this.ball.setVelocityDirection(newDirection);
    if (player instanceof AIPlayer) player.aimNextShot();
    this.audio.paddle.play();
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
  this.audio.point.play();
  this.render();
  this.stopGame();

  if (player.points < 5) {
    this.resetBall();
  } else {
    this.endGame();
  }
}

Game.prototype.resetBall = function() {
  this.ball.position = new Vector(300, 200);
  this.ball.velocity.x = -this.ball.velocity.x;
  this.render();

  window.setTimeout(this.startGame.bind(this), 500);
}

Game.prototype.endGame = function() {
  var winner = (this.players[0].points > this.players[1].points) ? 'Player 1' : 'Player 2';
  this.ctx.fillText(winner + " Wins!", 300, 200);

  // reset for the next game
  this.initializeEntities();
  this.canvas.blur();
}

Game.prototype.getScore = function() {
  var pointsArray = this.players.map(function(player) {
    return player.points;
  })
  return pointsArray.join(' - ');
}