var express = require( 'express' )
    ,app = express()
    ,port = 3700;

app.set( 'views', __dirname + '/tpl' );
app.set( 'view engine', 'jade' );
app.engine( 'jade', require('jade').__express );

app.use( express.static( __dirname + '/public' ) );

app.get( '/', function( req, res ){
    res.render( 'page' );
});

app.listen( port );
console.log( 'listening on port ' + port );