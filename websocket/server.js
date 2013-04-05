var  express = require( 'express' )
    ,app     = express();

app.listen( 1337, 'localhost' );

// Middleware
app.use( express.bodyParser() );

// Application level settings
app.set( 'view engine', 'ejs' );
app.set( 'views', __dirname + '/' );

// Routing
app.get( '/', function( req, res ){
    res.render( 'index' );
});

console.log( 'Server running at http://127.0.0.1:1337/' );
