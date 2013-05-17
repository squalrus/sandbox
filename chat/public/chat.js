window.onload = function( ){
    var messages    = []
        ,socket     = io.connect( 'http://localhost:3700' )
        ,field      = document.getElementById( 'field' )
        ,sendButton = document.getElementById( 'send' )
        ,content    = document.getElementById( 'content' );

        socket.on( 'message', function( data ){
            if( data.message ){
                messages.push( data.message );
                var html = '';
                for( var i=0; i<messages.length; i++ ){
                    html += messages[i] + '<br />';
                }
                content.innerHTML = html;
            }else{
                console.log( 'There is a problem: ', data );
            }
        });

        sendButton.onclick = function( ){
            var text = field.value;
            socket.emit( 'send', { message: text } );
        }
}