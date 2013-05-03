var express  = require( 'express' )
    ,mongodb = require( 'mongodb' )
    ,cluster = require( 'cluster' )
    ,os      = require( 'os' )
    ,server
    ,db
    ,collection
    ;

if( cluster.isMaster ){

    // Fork workers
    for( var i=0; i<os.cpus().length; i++ ){
        cluster.fork();
    }
} else {

    var app = express();

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
                ,size: 100000
                ,max: 10000
            }
            ,function( error, collection ){
                if( !error )
                    console.log( 'collection created!' );

                var cursor = collection.find({}, { tailable: true, awaitdata: true, timeout: false });

                function tail( cursor ){

                    try {
                        cursor.nextObject( function( error, item ){
                            if( error )
                                console.log( 'error! ' + error );
                            if( item ){
                                console.log( 'item!! ' + JSON.stringify( item ) );
                            }

                            tail( cursor );
                        });
                    } catch( e ) {
                        console.log( 'broke! ' + e.message );

                        cursor = collection.find({}, { tailable: true, awaitdata: true, timeout: false });

                        tail( cursor );
                    }
                }

                tail( cursor);

            }
        );
    });

    // Middleware
    app.use( express.bodyParser() );

    // Application level settings
    app.set( 'view engine', 'ejs' );

    // Routing
    app.get( '/', function( req, res ){
        res.render( 'index' );
    });

    app.post( '/', function( req, res ){
        var doc = { 'message': req.body.message };
        db.collection( 'stuff' ).insert( doc, { w: 1 }, function( error, result ){
            console.log( 'Added record -- ' + JSON.stringify( result ) );
        });

        res.send({ success: 1 });
    });

    console.log( 'Server running at http://127.0.0.1:1337/' );

}
