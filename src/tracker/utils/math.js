'use strict';

Math.toRadians = function ( grad ) {
  return grad * Math.PI / 180;
};

Math.toDegrees = function ( rad ) {
  return rad * 180 / Math.PI;
};

Math.sign = Math.sign || function(x) {
  x = +x; // преобразуем в число
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
}