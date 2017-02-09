/**
 * Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 * http://www.undefined.ch/mparser/index.html
**/

// Constants
var TNUMBER = 0;
var TOP1 = 1;
var TOP2 = 2;
var TVAR = 3;
var TFUNCALL = 4;

// Private methods
var object = function( o ) {
  var F = function() {};
  F.prototype = o;
  return new F();
};

// Token constructor
var Token = function( type, index, prio, number ) {
  this.type = type;
  this.index = index || 0;
  this.prio = prio || 0;
  this.number = !isNaN( number ) ? number : 0;
};

Token.prototype.toString = function() {
  switch ( this.type_ ) {
    case TNUMBER:
      return this.number_;
    case TOP1:
    case TOP2:
    case TVAR:
      return this.index_;
    case TFUNCALL:
      return 'CALL';
    default:
      return 'Invalid Token';
  }
};

// Expression constructor
var escapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

var meta = { // table of character substitutions
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  "'" : "\\'",
  '\\': '\\\\'
};

var escapeValue = function( v ) {
  if ( typeof v === 'string' ) {
    escapable.lastIndex = 0;
    
    if ( escapable.test( v ) ) {
      v = v.replace( escapable, function( a ) {
        var c = meta[ a ];
        
        if ( typeof c === 'string' ) {
          return c;
        } else {
          return '\\u' + ( '0000' + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 );
        }
      } );
    }
  }
  
  return '\'' + v + '\'';
};

var Expression = function( tokens, ops1, ops2, functions ) {
  this.tokens = tokens;
  this.ops1 = ops1;
  this.ops2 = ops2;
  this.functions = functions;
};

Expression.prototype.simplify = function( values ) {
  values = values || {};
  var nstack = [];
  var newexpression = [];
  var item, type, n1, n2, f, i, l;
  
  for ( i = 0, l = this.tokens.length; i < l; i++ ) {
    item = this.tokens[ i ];
    type = item.type;
    
    if ( type === TNUMBER ) {
      nstack.push( item );
    } else
    if ( type === TVAR && !!values[ item.index ] ) {
      item = new Token( TNUMBER, 0, 0, values[ item.index ] );
      nstack.push( item );
    } else
    if ( type === TOP2 && nstack.length > 1 ) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = this.ops2[ item.index ];
      item = new Token( TNUMBER, 0, 0, f( n1.number, n2.number ) );
      nstack.push( item );
    } else
    if ( type === TOP1 && nstack.length > 0 ) {
      n1 = nstack.pop();
      f = this.ops1[ item.index ];
      item = new Token( TNUMBER, 0, 0, f( n1.number ) );
      nstack.push( item );
    }
    else {
      while ( nstack.length > 0 ) {
        newexpression.push( nstack.shift() );
      }
      newexpression.push( item );
    }
  }
  
  while ( nstack.length > 0 ) {
    newexpression.push( nstack.shift() );
  }
  
  return new Expression( newexpression, object( this.ops1 ), object( this.ops2 ), object( this.functions ) );
};

Expression.prototype.substitute = function( variable, expr ) {
  if ( !( expr instanceof Expression ) ) {
    expr = new Parser().parse( String( expr ) );
  }
  
  var newexpression = [];
  var expritem, replitem, item, type, i, iL, j, jL;
  
  for ( i = 0, iL = this.tokens.length; i < iL; i++ ) {
    item = this.tokens[ i ];
    type = item.type;
    
    if ( type === TVAR && item.index === variable ) {
      for ( j = 0, jL = expr.tokens.length; j < jL; j++ ) {
        expritem = expr.tokens[ j ];
        replitem = new Token( expritem.type, expritem.index, expritem.prio, expritem.number );
        newexpression.push( replitem );
      }
    } else {
      newexpression.push( item );
    }
  }
  
  return new Expression( newexpression, object( this.ops1 ), object( this.ops2 ), object( this.functions ) );
};

Expression.prototype.evaluate = function( values ) {
  values = values || {};
  
  var item, i, iL, n1, n2, f;
  var nstack = [];
  
  for ( i = 0, iL = this.tokens.length; i < iL; i++ ) {
    item = this.tokens[ i ];
    
    var type = item.type;
    
    if ( type === TNUMBER ) {
      nstack.push( item.number );
    } else
    if ( type === TOP2 ) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = this.ops2[ item.index ];
      nstack.push( f( n1, n2 ) );
    } else
    if ( type === TVAR ) {
      if ( !isNaN( values[ item.index ] ) ) {
        nstack.push( values[ item.index ] );
      } else
      if ( !!this.functions[ item.index ] ) {
        nstack.push( this.functions[ item.index ] );
      }
      else {
        throw new Error( '[Math Parser] Undefined variable: ' + item.index );
      }
    } else
    if ( type === TOP1 ) {
      n1 = nstack.pop();
      f = this.ops1[ item.index ];
      nstack.push( f( n1 ) );
    } else
    if ( type === TFUNCALL ) {
      n1 = nstack.pop();
      f = nstack.pop();
      
      if ( f.apply && f.call ) {
        if ( n1.splice && n1.slice ) {
          nstack.push( f.apply( undefined, n1 ) );
        } else {
          nstack.push( f.call( undefined, n1 ) );
        }
      } else {
        throw new Error( '[Math Parser]' + f + ' is not a function' );
      }
    } else {
      throw new Error( '[Math Parser] invalid Expression' );
    }
  }
  
  if ( nstack.length > 1 ) {
    throw new Error( '[Math Parser]invalid Expression (parity)' );
  }
  
  return nstack[ 0 ];
};

Expression.prototype.variables = function() {
  var vars = [], item, i, l;
  
  for (  i = 0, l = this.tokens.length; i < l; i++ ) {
    item = this.tokens[ i ];
    
    if ( item.type === TVAR && vars.indexOf( item.index ) === -1 ) {
      vars.push( item.index );
    }
  }
  
  return vars;
};

Expression.prototype.toString = function( toJS ) {
  var nstack = [], item, type, n1, n2, f, i, l;
  
  for ( i = 0, l = this.tokens.length; i < l; i++ ) {
    item = this.tokens[ i ];
    type = item.type;
    
    if ( type === TNUMBER ) {
      nstack.push( escapeValue( item.number ) );
    } else
    if ( type === TOP2 ) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.index;
      
      if ( toJS && f === '^' ) {
        nstack.push( 'Math.pow(' + n1 + ',' + n2 + ')' );
      } else {
        nstack.push( '(' + n1 + f + n2 + ')' );
      }
    } else
    if ( type === TVAR ) {
      nstack.push( item.index );
    } else
    if ( type === TOP1 ) {
      n1 = nstack.pop();
      f = item.index;
      
      if ( f === '-' ) {
        nstack.push( '(' + f + n1 + ')' );
      } else {
        nstack.push( f + '(' + n1 + ')' );
      }
    } else
    if ( type === TFUNCALL ) {
      n1 = nstack.pop();
      f = nstack.pop();
      nstack.push( f + '(' + n1 + ')' );
    } else {
      throw new Error( '[Math Parser] invalid Expression' );
    }
  }
  
  if ( nstack.length > 1 ) {
    throw new Error( '[Math Parser] invalid Expression (parity)' );
  }
  
  return nstack[ 0 ];
};

Expression.prototype.toJSFunction = function( param, variables ) {
  return new Function( param, 'with( Parser.values ) { return ' + this.simplify( variables ).toString( true ) + '; }' );;
};

Expression.prototype.getListOfVariables = function() {
  var vars = [], i, l;
  
  for ( i = 0, l = this.tokens.length; i < l; i++ ) {
    if ( this.tokens[ i ].type === TVAR ) {
      vars.push( this.tokens[ i ].index );
    }
  }
  
  return vars;
};

/* Base operations */
var add = function( a, b ) {
  return a + b;
};

var sub = function( a, b ) {
  return a - b;
};

var mul = function( a, b ) {
  return a * b;
};

var div = function( a, b ) {
  return a / b;
};

var mod = function( a, b ) {
  return a % b;
};

var concat = function( a, b ) {
  return '' + a + b;
};

var equal = function( a, b ) {
  return a == b;
};

var notEqual = function( a, b ) {
  return a !== b;
};

var greaterThan = function( a, b ) {
  return a > b;
};

var lessThan = function( a, b ) {
  return a < b;
};

var greaterThanEqual = function( a, b ) {
  return a >= b;
};

var lessThanEqual = function( a, b ) {
  return a <= b;
};

var andOperator = function( a, b ) {
  return Boolean( a && b );
};

var orOperator = function( a, b ) {
  return Boolean( a || b );
};

var sign = function( a ) {
  if ( a === 0 ) {
    return 1;
  } else {
    return a / Math.abs( a );
  }
};

var sinh = function( a ) {
  return Math.sinh ? Math.sinh( a ) : ( ( Math.exp( a ) - Math.exp( -a) ) / 2 );
};

var cosh = function( a ) {
  return Math.cosh ? Math.cosh( a ) : ( ( Math.exp( a ) + Math.exp( -a ) ) / 2 );
};

var tanh = function( a ) {
  if ( Math.tanh ) {
    return Math.tanh( a );
  }
  
  if ( a === +Infinity ) {
    return 1;
  }
  
  if ( a === -Infinity ) {
    return -1;
  }
  
  return ( Math.exp( a ) - Math.exp( -a ) ) / ( Math.exp( a ) + Math.exp( -a ) );
};

var asinh = function( a ) {
  if ( Math.asinh ) {
    return Math.asinh( a );
  }
  
  if ( a === -Infinity ) {
    return a;
  }
  
  return Math.log( a + Math.sqrt( a * a + 1 ) );
};

var acosh = function( a ) {
  return Math.acosh ? Math.acosh( a ) : Math.log( a + Math.sqrt( a * a - 1 ) );
};

var atanh = function( a ) {
  return Math.atanh ? Math.atanh( a ) : ( Math.log( ( 1 + a ) / ( 1 - a ) ) / 2 );
};
  
var log10 = function( a ) {
  return Math.log( a ) * Math.LOG10E;
};

var neg = function( a ) {
  return -a;
};

var trunc = function( a ) {
  if ( Math.trunc ) {
    return Math.trunc( a );
  } else {
    return a < 0 ? Math.ceil( a ) : Math.floor( a );
  }
};

var random = function( a ) {
  return Math.random() * ( a || 1 );
};

var fac = function( a, b ) { // a!
  b = a = Math.floor( a );
  
  while ( a > 1 ) {
    b = b * (--a);
  }
  
  return b;
};

var hypot = function() {
  if ( Math.hypot ) {
    return Math.hypot.apply( this, arguments );
  }
  
  var i, l, y = 0;
  
  for ( i = 0, l = arguments.length; i < l; i++) {
    if ( arguments[ i ] === Infinity || arguments[ i ] === -Infinity) {
      return Infinity;
    }
    
    y += arguments[ i ] * arguments[ i ];
  }
  
  return Math.sqrt( y );
};

var condition = function( cond, yep, nope ) {
  return cond ? yep : nope;
};

var append = function( a, b ) {
  if ( !a.splice && !a.slice && !a.push ) {
    return [ a, b ];
  }
  
  a = a.slice();
  a.push( b );
  return a;
};

var parse_abs = function( expr ) {
  var operators = [ '+', '-', '*', '/', '^' ];
  var s_prev, s_next, s, i, l;
  var result = [];
  var c = 0;
  
  var isOperator = function( s ) {
    return operators.indexOf( s ) > -1;
  };
  
  var findPrevChar = function( n ) {
    while( expr[ n ] && expr[ n ].match( /\s/ ) ) {
      n--;
    }
    return expr[ n ];
  };
  
  var findNextChar = function( n ) {
    while( expr[ n ] && expr[ n ].match( /\s/ ) ) {
      n++;
    }
    return expr[ n ];
  };
  
  for ( i = 0, l = expr.length; i < l; i++ ) {
    s_prev = findPrevChar( i - 1 );
    s = expr[ i ];
    s_next = findNextChar( i + 1 );
    
    if ( s === '|' ) {
      if ( !s_prev || isOperator( s_prev ) ) {
        result.push( 'abs(' );
      } else {
        result.push( ')' );
      }
    } else {
      result.push( s );
    }
  }
  
  return result.join( '' );
};

var parse_sign = function( expr ) {
  return expr.replace( /([a-zA-z][a-zA-z0-1_]*)\/abs\(\1\)/g, 'sign($1)' );
};

/* Parser constructor */
var Parser = function() {
  this.success = false;
  this.errormsg = "";
  this.expression = "";
  
  this.pos = 0;
  
  this.tokennumber = 0;
  this.tokenprio = 0;
  this.tokenindex = 0;
  this.tmpprio = 0;
  
  this.ops1 = {
    "sin": Math.sin,
    "cos": Math.cos,
    "tan": Math.tan,
    "asin": Math.asin,
    "acos": Math.acos,
    "atan": Math.atan,
    "sinh": sinh,
    "cosh": cosh,
    "tanh": tanh,
    "asinh": asinh,
    "acosh": acosh,
    "atanh": atanh,
    "sign": sign,
    "sqrt": Math.sqrt,
    "log": Math.log,
    "lg" : log10,
    "log10" : log10,
    "abs": Math.abs,
    "ceil": Math.ceil,
    "floor": Math.floor,
    "round": Math.round,
    "trunc": trunc,
    "-": neg,
    "exp": Math.exp
  };
  
  this.ops2 = {
    "+": add,
    "-": sub,
    "*": mul,
    "/": div,
    "%": mod,
    "^": Math.pow,
    ",": append,
    "||": concat,
    "==": equal,
    "!=": notEqual,
    ">": greaterThan,
    "<": lessThan,
    ">=": greaterThanEqual,
    "<=": lessThanEqual,
    "and": andOperator,
    "or": orOperator
  };
  
  this.functions = {
    "random": random,
    "fac": fac,
    "min": Math.min,
    "max": Math.max,
    "hypot": hypot,
    "pyt": hypot, // backward compat
    "pow": Math.pow,
    "atan2": Math.atan2,
    "if": condition
  };
  
  this.consts = {
    "E": Math.E,
    "PI": Math.PI
  };
};

Parser.parse = function( expr ) {
  return new Parser().parse( expr );
};

Parser.evaluate = function( expr, variables ) {
  return Parser.parse( expr ).evaluate( variables );
};

Parser.Expression = Expression;

Parser.values = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: sinh,
  cosh: cosh,
  tanh: tanh,
  asinh: asinh,
  acosh: acosh,
  atanh: atanh,
  sqrt: Math.sqrt,
  log: Math.log,
  lg: log10,
  log10: log10,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  trunc: trunc,
  random: random,
  fac: fac,
  exp: Math.exp,
  min: Math.min,
  max: Math.max,
  hypot: hypot,
  pyt: hypot, // backward compat
  pow: Math.pow,
  atan2: Math.atan2,
  if: condition,
  E: Math.E,
  PI: Math.PI
};

var PRIMARY      = 1 << 0;
var OPERATOR     = 1 << 1;
var FUNCTION     = 1 << 2;
var LPAREN       = 1 << 3;
var RPAREN       = 1 << 4;
var COMMA        = 1 << 5;
var SIGN         = 1 << 6;
var CALL         = 1 << 7;
var NULLARY_CALL = 1 << 8;

Parser.prototype.parse = function(expr) {
  expr = parse_abs( expr );
  expr = parse_sign( expr );
  
  this.errormsg = '';
  this.success = true;
  this.tmpprio = 0;
  this.expression = expr;
  this.pos = 0;
  
  var operstack = [];
  var tokenstack = [];
  var expected = ( PRIMARY | LPAREN | FUNCTION | SIGN );
  var noperators = 0;
  var token, consttoken, vartoken;
  
  while ( this.pos < this.expression.length ) {
    if ( this.isOperator() ) {
      if ( this.isSign() && ( expected & SIGN ) ) {
        if ( this.isNegativeSign() ) {
          this.tokenprio = 2;
          this.tokenindex = "-";
          noperators++;
          this.addfunc( tokenstack, operstack, TOP1 );
        }
        
        expected = ( PRIMARY | LPAREN | FUNCTION | SIGN );
      } else
      if ( this.isComment() ) {
        // Nothing to do
      } else {
        if ( ( expected & OPERATOR ) === 0 ) {
          this.error_parsing( this.pos, 'unexpected operator' );
        }
        
        noperators += 2;
        this.addfunc( tokenstack, operstack, TOP2 );
        
        expected = ( PRIMARY | LPAREN | FUNCTION | SIGN );
      }
    } else
    if ( this.isNumber() ) {
      if ( ( expected & PRIMARY ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected number' );
      }
      
      token = new Token( TNUMBER, 0, 0, this.tokennumber );
      tokenstack.push( token );
      
      expected = ( OPERATOR | RPAREN | COMMA );
    } else
    if ( this.isString() ) {
      if ( ( expected & PRIMARY ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected string' );
      }
      
      token = new Token( TNUMBER, 0, 0, this.tokennumber );
      tokenstack.push( token );
      
      expected = ( OPERATOR | RPAREN | COMMA );
    } else
    if ( this.isLeftParenth() ) {
      if ( ( expected & LPAREN ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected "("' );
      }
      
      if ( expected & CALL ) {
        noperators += 2;
        this.tokenprio = -2;
        this.tokenindex = -1;
        this.addfunc( tokenstack, operstack, TFUNCALL );
      }
      
      expected = ( PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL );
    } else
    if ( this.isRightParenth() ) {
      if ( expected & NULLARY_CALL ) {
        token = new Token( TNUMBER, 0, 0, [] );
        tokenstack.push( token );
      } else
      if ( ( expected & RPAREN ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected ")"' );
      }
      
      expected = ( OPERATOR | RPAREN | COMMA | LPAREN | CALL );
    } else
    if ( this.isComma() ) {
      if ( ( expected & COMMA ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected ","' );
      }
      
      this.addfunc( tokenstack, operstack, TOP2 );
      noperators += 2;
      
      expected = ( PRIMARY | LPAREN | FUNCTION | SIGN );
    } else
    if ( this.isConst() ) {
      if ( ( expected & PRIMARY ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected constant' );
      }
      
      consttoken = new Token( TNUMBER, 0, 0, this.tokennumber );
      tokenstack.push( consttoken );
      expected = ( OPERATOR | RPAREN | COMMA );
    } else
    if ( this.isOp2() ) {
      if ( ( expected & FUNCTION ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected function' );
      }
      
      this.addfunc( tokenstack, operstack, TOP2 );
      noperators += 2;
      
      expected = ( LPAREN );
    } else
    if ( this.isOp1() ) {
      if ( ( expected & FUNCTION ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected function' );
      }
      
      this.addfunc( tokenstack, operstack, TOP1 );
      noperators++;
      
      expected = ( LPAREN );
    } else
    if ( this.isVar() ) {
      if ( ( expected & PRIMARY ) === 0 ) {
        this.error_parsing( this.pos, 'unexpected variable' );
      }
      
      vartoken = new Token( TVAR, this.tokenindex, 0, 0 );
      tokenstack.push( vartoken );
      
      expected = ( OPERATOR | RPAREN | COMMA | LPAREN | CALL );
    } else
    if ( this.isWhite() ) {
      // Nothing to do
    } else {
      if ( this.errormsg === '' ) {
        this.error_parsing( this.pos, 'unknown character' );
      } else {
        this.error_parsing( this.pos, this.errormsg );
      }
    }
  }
  
  if ( this.tmpprio < 0 || this.tmpprio >= 10 ) {
    this.error_parsing( this.pos, 'unmatched "()"' );
  }
  
  while ( operstack.length > 0 ) {
    var tmp = operstack.pop();
    tokenstack.push( tmp );
  }
  
  if ( noperators + 1 !== tokenstack.length ) {
    this.error_parsing( this.pos, 'parity' );
  }
  
  return new Expression( tokenstack, object( this.ops1 ), object( this.ops2 ), object( this.functions ) );
};

Parser.prototype.evaluate = function( expr, variables ) {
  return this.parse( expr ).evaluate( variables );
};

Parser.prototype.error_parsing = function( column, msg ) {
  this.success = false;
  this.errormsg = '[Math Parser] parse error [column ' + ( column ) + ']: ' + msg;
  this.column = column;
  throw new Error( this.errormsg );
};

Parser.prototype.addfunc = function( tokenstack, operstack, type ) {
  var operator = new Token( type, this.tokenindex, this.tokenprio + this.tmpprio, 0 );
  
  while ( operstack.length > 0 ) {
    if ( operator.prio <= operstack[ operstack.length - 1].prio ) {
      tokenstack.push( operstack.pop() );
    } else {
      break;
    }
  }
  
  operstack.push( operator );
};

Parser.prototype.isNumber = function() {
  var r = false;
  var str = '';
  
  while ( this.pos < this.expression.length ) {
    var code = this.expression.charCodeAt( this.pos );
    
    if ( ( code >= 48 && code <= 57 ) || code === 46 ) {
      str += this.expression.charAt( this.pos );
      this.pos++;
      this.tokennumber = parseFloat( str );
      r = true;
    } else {
      break;
    }
  }
  
  return r;
};

Parser.prototype.unescape = function( v, pos ) {
  var buffer = [];
  var escaping = false;
  var codePoint, i, l, c;
  
  for ( i = 0, l = v.length; i < l; i++ ) {
    c = v.charAt( i );
    
    if ( escaping ) {
      switch( c ) {
        case '\'':
          buffer.push( '\'' );
          break;
        case '\\':
          buffer.push( '\\' );
          break;
        case '/':
          buffer.push( '/' );
          break;
        case 'b':
          buffer.push( '\b' );
          break;
        case 'f':
          buffer.push( '\f' );
          break;
        case 'n':
          buffer.push( '\n' );
          break;
        case 'r':
          buffer.push( '\r' );
          break;
        case 't':
          buffer.push( '\t' );
          break;
        case 'u':
          // Interpret the following 4 characters as the hex of the unicode code point
          codePoint = parseInt( v.substring( i + 1, i + 5 ), 16 );
          buffer.push( String.fromCharCode( codePoint ) );
          i += 4;
          break;
        default:
          throw this.error_parsing( pos + i, 'Illegal escape sequence: "\\' + c + '"' );
      }
      
      escaping = false;
    } else {
      if ( c === '\\' ) {
        escaping = true;
      } else {
        buffer.push( c );
      }
    }
  }
  
  return buffer.join( '' );
};

Parser.prototype.isString = function() {
  var r = false, str = '', code;
  var startpos = this.pos;
  
  if ( this.pos < this.expression.length && this.expression.charAt(this.pos) === '\'' ) {
    this.pos++;
    
    while( this.pos < this.expression.length ) {
      code = this.expression.charAt( this.pos );
      
      if ( code !== '\'' || str.slice( -1 ) === '\\' ) {
        str += this.expression.charAt( this.pos );
        this.pos++;
      } else {
        this.pos++;
        this.tokennumber = this.unescape( str, startpos );
        r = true;
        break;
      }
    }
  }
  
  return r;
};

Parser.prototype.isConst = function() {
  var str, i, L;
  
  for ( i in this.consts ) {
    L = i.length;
    str = this.expression.substr( this.pos, L );
    
    if ( i === str ) {
      this.tokennumber = this.consts[ i ];
      this.pos += L;
      return true;
    }
  }
  
  return false;
};

Parser.prototype.isOperator = function() {
  var code = this.expression.charCodeAt( this.pos );
  
  if ( code === 43 ) { // +
    this.tokenprio = 2;
    this.tokenindex = '+';
  } else
  if ( code === 45 ) { // -
    this.tokenprio = 2;
    this.tokenindex = '-';
  } else
  if ( code === 62 ) { // >
    if ( this.expression.charCodeAt( this.pos + 1 ) === 61 ) {
      this.pos++;
      this.tokenprio = 1;
      this.tokenindex = '>=';
    } else {
      this.tokenprio = 1;
      this.tokenindex = '>';
    }
  } else
  if ( code === 60 ) { // <
    if ( this.expression.charCodeAt( this.pos + 1 ) === 61 ) {
      this.pos++;
      this.tokenprio = 1;
      this.tokenindex = '<=';
    } else {
      this.tokenprio = 1;
      this.tokenindex = '<';
    }
  } else
  if ( code === 124 ) { // |
    if ( this.expression.charCodeAt( this.pos + 1 ) === 124 ) {
      this.pos++;
      this.tokenprio = 1;
      this.tokenindex = '||';
    } else {
      return false;
    }
  } else
  if ( code === 61 ) { // =
    if ( this.expression.charCodeAt( this.pos + 1 ) === 61 ) {
      this.pos++;
      this.tokenprio = 1;
      this.tokenindex = '==';
    } else {
      return false;
    }
  } else
  if ( code === 33 ) { // !
    if ( this.expression.charCodeAt( this.pos + 1 ) === 61 ) {
      this.pos++;
      this.tokenprio = 1;
      this.tokenindex = '!=';
    } else {
      return false;
    }
  } else
  if ( code === 97 ) { // a
    if ( this.expression.charCodeAt( this.pos + 1 ) === 110 && this.expression.charCodeAt( this.pos + 2 ) === 100) { // n && d
      this.pos++;
      this.pos++;
      this.tokenprio = 0;
      this.tokenindex = 'and';
    } else {
      return false;
    }
  } else
  if ( code === 111 ) { // o
    if ( this.expression.charCodeAt( this.pos + 1 ) === 114 ) { // r
      this.pos++;
      this.tokenprio = 0;
      this.tokenindex = 'or';
    } else {
      return false;
    }
  } else
  if ( code === 42 || code === 8729 || code === 8226 ) { // * or ∙ or •
    this.tokenprio = 3;
    this.tokenindex = '*';
  } else
  if ( code === 47 ) { // /
    this.tokenprio = 4;
    this.tokenindex = '/';
  } else
  if ( code === 37 ) { // %
    this.tokenprio = 4;
    this.tokenindex = '%';
  } else
  if ( code === 94 ) { // ^
    this.tokenprio = 5;
    this.tokenindex = '^';
  } else {
    return false;
  }
  
  this.pos++;
  
  return true;
};

Parser.prototype.isSign = function() {
  var code = this.expression.charCodeAt( this.pos - 1 );
  
  if ( code === 45 || code === 43 ) { // -
    return true;
  }
  
  return false;
};

Parser.prototype.isPositiveSign = function() {
  var code = this.expression.charCodeAt( this.pos - 1 );
  
  if ( code === 43 ) { // +
    return true;
  }
  
  return false;
};

Parser.prototype.isNegativeSign = function() {
  var code = this.expression.charCodeAt( this.pos - 1 );
  
  if ( code === 45 ) { // -
    return true;
  }
  
  return false;
};

Parser.prototype.isLeftParenth = function() {
  var code = this.expression.charCodeAt( this.pos );
  
  if ( code === 40 ) { // (
    this.pos++;
    this.tmpprio += 10;
    return true;
  }
  
  return false;
}

Parser.prototype.isRightParenth = function() {
  var code = this.expression.charCodeAt( this.pos );
  
  if ( code === 41 ) { // )
    this.pos++;
    this.tmpprio -= 10;
    return true;
  }
  
  return false;
};

Parser.prototype.isComma = function() {
  var code = this.expression.charCodeAt( this.pos );
  
  if ( code === 44 ) { // ,
    this.pos++;
    this.tokenprio = -1;
    this.tokenindex = ',';
    return true;
  }
  
  return false;
};

Parser.prototype.isWhite = function() {
  var code = this.expression.charCodeAt( this.pos );
  
  if ( code === 32 || code === 9 || code === 10 || code === 13 ) {
    this.pos++;
    return true;
  }
  
  return false;
};

Parser.prototype.isOp1 = function() {
  var str = '', i, l, c;
  
  for ( i = this.pos, l = this.expression.length; i < l; i++ ) {
    c = this.expression.charAt( i );
    
    if ( c.toUpperCase() === c.toLowerCase() ) {
      if ( i === this.pos || ( c !== '_' && ( c < '0' || c > '9') ) ) {
        break;
      }
    }
    
    str += c;
  }
  
  if ( str.length > 0 && !!this.ops1[ str ] ) {
    this.tokenindex = str;
    this.tokenprio = 5;
    this.pos += str.length;
    return true;
  }
  
  return false;
};

Parser.prototype.isOp2 = function() {
  var str = '', i, l, c;
  
  for ( i = this.pos, l = this.expression.length; i < l; i++ ) {
    c = this.expression.charAt( i );
    
    if ( c.toUpperCase() === c.toLowerCase() ) {
      if ( i === this.pos || ( c !== '_' && ( c < '0' || c > '9') ) ) {
        break;
      }
    }
    
    str += c;
  }
  
  if ( str.length > 0 && !!this.ops2[ str ] ) {
    this.tokenindex = str;
    this.tokenprio = 5;
    this.pos += str.length;
    return true;
  }
  
  return false;
};

Parser.prototype.isVar = function() {
  var str = '', i, l, c;
  
  for ( i = this.pos, l = this.expression.length; i < l; i++ ) {
    c = this.expression.charAt( i );
    
    if ( c.toUpperCase() === c.toLowerCase() ) {
      if ( i === this.pos || ( c !== '_' && ( c < '0' || c > '9' ) ) ) {
        break;
      }
    }
    
    str += c;
  }
  
  if ( str.length > 0 ) {
    this.tokenindex = str;
    this.tokenprio = 4;
    this.pos += str.length;
    return true;
  }
  
  return false;
};

Parser.prototype.isComment = function() {
  var code = this.expression.charCodeAt( this.pos - 1 );
  
  if ( code === 47 && this.expression.charCodeAt( this.pos ) === 42 ) {
    this.pos = this.expression.indexOf( '*/', this.pos ) + 2;
    
    if ( this.pos === 1 ) {
      this.pos = this.expression.length;
    }
    
    return true;
  }
  
  return false;
};
window.Parser = Parser;
module.exports = Parser;