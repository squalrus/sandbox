var express = require( 'express' )
    ,mongo  = require( 'mongoskin' )
    ,app    = express()
    ,db
    ,collection
    ;

app.listen( 1337, 'localhost' );

db = mongo.db( 'localhost:27017/thing', { safe: true });
collection = db.collection( 'stuff' );

// Middleware
app.use( express.bodyParser() );

// Application level settings
app.set( 'view engine', 'ejs' );

// Routing
app.get( '/', function( req, res ){
    collection.find().toArray( function( err, items ){
        res.render( 'index', { data: items });
    });
});

// AJAX route to find stuff?

// Then one to send? ...to test?

console.log( 'Server running at http://127.0.0.1:1337/' );
