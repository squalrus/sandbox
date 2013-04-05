var  express = require( 'express' )
    ,app     = express()
    ,server  = require( 'http' ).createServer( app )
    ,io      = require( 'socket.io' ).listen( server )
    ,cluster = require( 'cluster' )
    ,os      = require( 'os' );

function start( route ){

    // Multithreading
    if( cluster.isMaster ){

        // Fork workers
        for( var i=0; i<os.cpus().length; i++ ){
            cluster.fork();
        }

        cluster.on( 'exit', function( worker ){
            console.log( 'Worker #' + worker.process.pid + ' died. *sadface*');
            cluster.fork();
        });
    }else{
        server.listen( 1337 );

        // Middleware
        app.use( express.bodyParser() );
        app.use( express.cookieParser() );
        // app.use( express.session({ secret: 'internet'}) );
        app.use( express.compress() );
        app.use( express.static( __dirname + '/public', { maxAge: 86400000 }) );

        // Application level settings
        app.set( 'view engine', 'ejs' );

        // Routing - w/ template
        app.get( '/form', function( req, res ){
            res.render( 'form.ejs' );
        });

        // Routing
        app.get( '/', function( req, res ){

            res.render( 'index' );

            // res.writeHead( 200, {'Content-Type': 'text/plain'} );

            // res.write( 'Request\n' );
            // res.write( '----------------------------------------\n' );
            // res.write( 'Request: ' + req + '\n' );

            // res.write( '\n' );

            // res.write( 'CPU Stuff!\n' );
            // res.write( '----------------------------------------\n' );
            // res.write( 'Hostname: ' + os.hostname() + '\n' );
            // res.write( 'OS Name: ' + os.type() + '\n' );
            // res.write( 'OS Platform: ' + os.platform() + '\n' );
            // res.write( 'OS Release: ' + os.release() + '\n' );
            // res.write( 'CPU Arch: ' + os.arch() + '\n' );
            // res.write( 'CPUS: ' + os.cpus().length + '\n' );
            // res.write( 'Uptime: ' + os.uptime() + '\n' );

            // res.write( '\n' );

            // res.write( 'Workers \'n Junk\n' );
            // res.write( '----------------------------------------\n' );
            // res.write( 'Workers: ' + cluster.length ) + '\n';
            // res.write( 'Worker: #' + cluster.worker.id );

            // res.end();
        });

        // Routing - POST
        app.post( '/', function( req, res ){
            res.send( req.body );
        });

        // Socket stuff
        // Add a connect listener
        io.sockets.on( 'connection', function( socket ){

            // Success, listen to messages to be recieved
            socket.on( 'message', function( event ){
                console.log( 'Recieved message from client!', event );
            });

            socket.on( 'disconnect', function(){
                clearInterval( interval );
                console.log( 'Server has disconnected' );
            });

            // Send a message every once and a while
            var interval = setInterval( function(){
                socket.send( 'Hello! - the server @ ' + new Date().getTime() );
            }, 5000 );
        });

        console.log( 'Server running! Courtesy of Worker #' + cluster.worker.id );
    }

}

exports.start = start;
