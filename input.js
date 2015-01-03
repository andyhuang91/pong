function InputEngine(canvas) {
  // key bindings - maps ASCII key codes to string values describing
  // the action toperform when the key is pressed
  this.bindings = {};

  // dictionary mapping game actions to a boolean value indicating
  // whether that action is currently being performed.
  this.actions = {};

  this.initialize(canvas);
}

InputEngine.prototype.initialize = function(canvas) {
  this.__setupKeyBindings();
  canvas.addEventListener('keydown', this.onKeyDown.bind(this));
  canvas.addEventListener('keyup', this.onKeyUp.bind(this));
}

InputEngine.prototype.__setupKeyBindings = function() {
  var KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }

  this.bindings[KEY_CODES.UP] = 'moveUp';
  this.bindings[KEY_CODES.DOWN] = 'moveDown';
  this.bindings[KEY_CODES.LEFT] = 'moveLeft';
  this.bindings[KEY_CODES.RIGHT] = 'moveRight';
}

InputEngine.prototype.onKeyDown = function(event) {
  event.preventDefault();
  var action = this.bindings[event.keyCode];
  if (action) this.actions[action] = true;
}

InputEngine.prototype.onKeyUp = function(event) {
  event.preventDefault();
  var action = this.bindings[event.keyCode];
  if (action) this.actions[action] = false;
}