var  express = require( 'express' )
    ,app     = express()
    ,io      = require( 'socket.io' ).listen( app )
    ,os      = require( 'os' );

function start( route ){

    app.listen( 1337, 'pallas.it.corp' );

    // Middleware
    app.use( express.bodyParser() );
    app.use( express.cookieParser() );
    app.use( express.session({ secret: 'internet'}) );

    // Application level settings
    app.set( 'view engine', 'ejs' );

    // Routing
    app.get( '/form', function( req, res ){
        res.render( 'form.ejs' );
    });

    app.get( '/', function( req, res ){

        res.writeHead( 200, {'Content-Type': 'text/plain'} );

        res.write( 'Request\n' );
        res.write( '----------------------------------------\n' );
        res.write( 'Request: ' + req + '\n' );

        res.write( '\n' );

        res.write( 'CPU Stuff!\n' );
        res.write( '----------------------------------------\n' );
        res.write( 'Hostname: ' + os.hostname() + '\n' );
        res.write( 'OS Name: ' + os.type() + '\n' );
        res.write( 'OS Platform: ' + os.platform() + '\n' );
        res.write( 'OS Release: ' + os.release() + '\n' );
        res.write( 'CPU Arch: ' + os.arch() + '\n' );
        res.write( 'CPUS: ' + os.cpus().length + '\n' );
        res.write( 'Uptime: ' + os.uptime() + '\n' );

        res.write( '\n' );

        res.write( 'Workers \'n Junk\n' );
        res.write( '----------------------------------------\n' );
        res.write( 'Workers: ' + 0 );

        res.end();
    });

    app.post( '/', function( req, res ){
        res.send( req.body );
    });

    // Socket stuff
    io.sockets.on( 'connection', function( socket ){
        socket.emit( 'news', { hello: 'world' });
        socket.on( 'my other event', function( data ){
            console.log( data );
        });
    });

    console.log( 'Server running at http://127.0.0.1:1337/' );
}

exports.start = start;
