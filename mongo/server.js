var express  = require( 'express' )
    ,mongodb = require( 'mongodb' )
    ,app     = express()
    ,server
    ,db
    ,collection
    ;

app.listen( 1337, 'localhost' );

// Create server connection
server = new mongodb.Server( 'localhost', '27017', {
    auto_reconnect: true    // Default false
    ,poolSize: 5            // Default 5
});

// Connect/Create database
db = new mongodb.Db( 'thing', server, {
    safe: true
});

// Open database
db.open( function( error, client ){
    if( !error )
        console.log( 'connected to db!' );

    // Connect/Create collection
    db.createCollection( 'stuff'
        ,{
            capped: true
            ,size: 1000
            ,max: 10
        }
        ,function( error, collection ){
            if( !error )
                console.log( 'collection created!' );

            setInterval( function( ){
                var doc = { 'message': 'Hi there!' };
                collection.insert( doc );

                var lastValue = mongodb.MinKey();
                console.log( 'MinKey: ' + JSON.stringify( lastValue ) );
            }, 5000 );

            var lastValue = mongodb.MinKey();
            console.log( 'MinKey: ' + JSON.stringify( lastValue ) );


            function tail( ){
                var lastValue = mongodb.MinKey();

                console.log( 'MinKey: ' + lastValue );
            }
        });
});

// Middleware
app.use( express.bodyParser() );

// Application level settings
app.set( 'view engine', 'ejs' );

// Routing
app.get( '/', function( req, res ){
    res.render( 'index' );
});

// AJAX route to find stuff?

// Then one to send? ...to test?

console.log( 'Server running at http://127.0.0.1:1337/' );
