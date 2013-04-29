var  express    = require( 'express' )
    ,app        = express()
    ,http       = require( 'http' )
    ,io         = require( 'socket.io' )
    ,cluster    = require( 'cluster' )
    ,os         = require( 'os' )
    ,MongoStore = require( 'socket.io-mongo' )
    // ,MongoStore = require( 'mong.socket.io' )
    ;

// Multithreading
if( cluster.isMaster ){

    // Fork workers
    for( var i=0; i<os.cpus().length; i++ ){
        cluster.fork();
    }

    var workerIds = Object.keys( cluster.workers );

    workerIds.forEach( function( id ){
        cluster.workers[ id ].on( 'message', function( message ){
            console.log( 'Master recieved message from Worker #' + id );
            var muleWorkerId = workerIds[ Math.floor( Math.random() * workerIds.length ) ];
            var muleWorker = cluster.workers[ muleWorkerId ];
            console.log( 'Sending to Worker #' + muleWorkerId );
            muleWorker.send( message );
        });
    });

    cluster.on( 'exit', function( worker ){
        console.log( 'Worker #' + worker.process.pid + ' died.');
        cluster.fork();
    });

    cluster.on( 'listening', function( worker, address ){
        console.log( 'A worker is now connected to ' + address.address + ':' + address.port );
    });

}else{

    var a = express();
    var s = http.createServer( app );
    var sio = io.listen( s );

    s.listen( 1337 );

    // Middleware
    app.use( express.bodyParser() );
    app.use( express.cookieParser() );
    app.use( express.session({ secret: 'internet'}) );
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

        res.render( 'index', {
            worker: cluster.worker.id
        });

    });

    // Routing - POST
    app.post( '/', function( req, res ){
        res.send( req.body );
    });

    // Socket stuff
    // MONGO STORE
    sio.configure(function() {
        var store = new MongoStore({ url: 'mongodb://localhost:27017/socketio' });
        store.on( 'error', console.error );
        sio.set( 'store', store );
    });

    // Add a connect listener
    sio.sockets.on( 'connection', function( socket ){

        socket.emit( 'welcome', { msg: 'oh hai!' });

        // Success, listen to messages to be recieved
        socket.on( 'message', function( message ){
            console.log( 'Worker recieved message from client: ', message );
            process.send( message );
        });

        // Listening to Master
        process.on( 'message', function( message ){
            socket.send( 'Message recieved and dispatched via Worker #' + cluster.worker.id );
        });

        socket.on( 'error', function( message ){
            console.log( 'Error: ' + message );
        })

        socket.on( 'disconnect', function(){
            console.log( 'Server has disconnected' );
        });

        // Send a message every once and a while
        setInterval( function(){
            var cpus = os.cpus().length
                ,load = os.loadavg()[0]
                ,curLoad = Math.floor( ( load / cpus ) * 100 );

            socket.send( 'Worker #' + cluster.worker.id + ' CPU: ' + curLoad + ' %' );
        }, 5000 );
    });

    console.log( 'Server running! Courtesy of Worker #' + cluster.worker.id );
}
