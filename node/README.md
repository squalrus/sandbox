## node.js
It's node.js + socket.io + cluster + redis/mongo!

04/26/2013
Test: every five seconds, send message to client via socket.io on the CPU usage.

### Single - Redis

Server Message: CPU: 10 %
Server Message: CPU: 10 %
Server Message: CPU: 9 %
Server Message: CPU: 8 %
Server Message: CPU: 9 %
Server Message: CPU: 9 %
Server Message: CPU: 8 %
Server Message: CPU: 9 %
Server Message: CPU: 8 %
Server Message: CPU: 8 %
Server Message: CPU: 7 %
Server Message: CPU: 6 %
Server Message: CPU: 6 %
Server Message: CPU: 5 %
Server Message: CPU: 5 %

### Single - Mongo

Server Message: CPU: 8 %
Server Message: CPU: 7 %
Server Message: CPU: 7 %
Server Message: CPU: 6 %
Server Message: CPU: 5 %
Server Message: CPU: 5 %
Server Message: CPU: 5 %
Server Message: CPU: 4 %
Server Message: CPU: 4 %
Server Message: CPU: 3 %
Server Message: CPU: 3 %
Server Message: CPU: 5 %
Server Message: CPU: 4 %
Server Message: CPU: 4 %
Server Message: CPU: 4 %

### Multi - Redis

Server Message: CPU: 4 %
Server Message: CPU: 3 %
Server Message: CPU: 3 %
Server Message: CPU: 3 %
Server Message: CPU: 4 %
Server Message: CPU: 6 %
Server Message: CPU: 5 %
Server Message: CPU: 5 %
Server Message: CPU: 5 %
Server Message: CPU: 6 %
Server Message: CPU: 6 %
Server Message: CPU: 7 %
Server Message: CPU: 7 %
Server Message: CPU: 8 %

### Multi - Mongo

broke.
