var express = require( 'express' )
    ,app = express()
    ,port = 3700;

app.get( '/', function( req, res ){
    res.send( 'It worked!' );
});

app.listen( port );
console.log( 'listening on port ' + port );