var express   = require( 'express' )
    ,jade     = require( 'jade' )
    ,socketio = require( 'socket.io' )
    ,app      = express()
    ,port     = 3700
    ,io;

app.set( 'views', __dirname + '/tpl' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', jade.__express );

app.use( express.static( __dirname + '/public' ) );

app.get( '/', function( req, res ){
    res.render( 'page' );
});

io = socketio.listen( app.listen( port ) );

io.sockets.on( 'connection', function( socket ){
    socket.emit( 'message', { message: 'Welcome to the chat!' } );
    socket.on( 'send', function( data ){
        io.sockets.emit( 'message', data );
    });
});

console.log( 'listening on port ' + port );