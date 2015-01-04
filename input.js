function InputEngine(canvas) {
  // key bindings - maps ASCII key codes to string values describing
  // the action toperform when the key is pressed. player-specific
  // actions should end with the player index (ex. moveUp1, moveUp2)
  this.bindings = {};

  // maps game actions to a boolean value indicating whether that
  // action is currently being performed. player-specific actions
  // are represented in their own nested player objects
  this.actions = {
    player1: {},
    player2: {}
  };

  this.initialize();
}

InputEngine.prototype.initialize = function() {
  this.__setupKeyBindings();
  document.addEventListener('keydown', this.onKeyDown.bind(this));
  document.addEventListener('keyup', this.onKeyUp.bind(this));
}

InputEngine.prototype.__setupKeyBindings = function() {
  var KEY_CODES = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }

  this.bindings[KEY_CODES.W] = 'moveUp1';
  this.bindings[KEY_CODES.S] = 'moveDown1';
  //this.bindings[KEY_CODES.A] = 'moveLeft1';
  //this.bindings[KEY_CODES.D] = 'moveRight1';

  this.bindings[KEY_CODES.UP] = 'moveUp2';
  this.bindings[KEY_CODES.DOWN] = 'moveDown2';
  //this.bindings[KEY_CODES.LEFT] = 'moveLeft2';
  //this.bindings[KEY_CODES.RIGHT] = 'moveRight2';
}

InputEngine.prototype.onKeyDown = function(event) {
  event.preventDefault();
  var action = this.bindings[event.keyCode];
  if (action) this.toggleAction(action, true);
}

InputEngine.prototype.onKeyUp = function(event) {
  event.preventDefault();
  var action = this.bindings[event.keyCode];
  if (action) this.toggleAction(action, false);
}

InputEngine.prototype.toggleAction = function(action, isActive) {
  var playerSpecificAction = action.match(/(.+[A-z])(\d+)$/),
      parsedAction,
      playerIndex;

  if (playerSpecificAction) {
    parsedAction = playerSpecificAction[1]
    playerIndex = playerSpecificAction[2]
    this.actions['player' + playerIndex][parsedAction] = isActive;
  } else {
    this.actions[action] = isActive;
  }
}