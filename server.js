const CryptoJS = require('crypto-js'); //library za kodiranje podatkov
const { Buffer } = require('buffer');
var crypto = require('crypto');
const httpDownload = require('http');
const fs = require('fs');   //za branje datotek (filestream)

var args = process.argv.slice(2);   //argumenti brez prvih dveh - nastane array
console.log(args);
const port = args[0];               //port za server
const p2p_port = args[1];           //port za p2p server

//server
const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//p2p server
var server_p2p_server = require('http').createServer();
var server_p2p_io = require('socket.io')(server_p2p_server);
var server_p2p = require('socket.io-p2p-server').Server;
server_p2p_io.use(server_p2p);
server_p2p_server.listen(p2p_port);

//p2p client
var p2p = require('socket.io-p2p');
var client_p2p_io = require('socket.io-client');

var client_secrets = new Map(); //za hranjenje ključev
const SocketIOFile = require('socket.io-file'); //https://www.npmjs.com/package/socket.io-file

//generiramo ključe --- https://www.geeksforgeeks.org/node-js-crypto-getdiffiehellman-method/
//var key = "Jasa";
var key = {
    client: crypto.getDiffieHellman('modp14'),  //kličemo s parametrom groupName
    server: crypto.getDiffieHellman('modp14')
}
key.client.generateKeys();  //generiramo ključe
key.server.generateKeys();

function encryptFile(name, key){
    console.log(`Encrypt file key: ${key}`);
    var fileData = fs.readFileSync("data/" + name);
    var encrypted = CryptoJS.AES.encrypt(fileData.toString('hex'), key);
    //console.log(`Encrypted: ${encrypted}`);
    var encryptedName = Buffer.from(encrypted.toString(), 'utf-8');
    console.log(encryptedName);
    fs.writeFileSync(`encrypted/` + name, encryptedName);
    return name;
}

function decryptFile(name, key){
    console.log(`Decrypt file key: ${key}`);
    var fileData = fs.readFileSync(`download/${name}`);                         //preberi data datoteke
    var decrypted = CryptoJS.AES.decrypt(fileData.toString('utf-8'), key);      //dešifriraj ime datoteke
    //console.log(`Decrypted: ${decrypted}`);
    var decryptedName = Buffer.from(decrypted.toString(CryptoJS.enc.Utf8), 'hex');  //
    fs.writeFileSync('decrypted/' + name, decryptedName);
}

async function download(path, name, secret, socket){
    if (!fs.existsSync('./download')){  //če še ne obstaja, ustvarimo mapo
        fs.mkdirSync('./download')
    }

    const file = fs.createWriteStream('download/' + name);
    httpDownload.get(path, (msg) => {
        console.log(msg);
        msg.pipe(file);
        file.on('finish', () => {
            var n = decryptFile(name, secret);

            app.get('/' + n, (req, res) => {
                res.sendFile(_dirname + '/decrypted/' + n);
            })            
            var file = {    //za datoteko naredimo objekt z imenom ter naslovom
                filename: n,
                link: `http://localhost:${port}/${n}`
            }

            socket.emit('download-link', file);
        })
    })
}

app.get('/', (req, res) => {    //website home
    res.sendFile(__dirname + '/index.html');    //naložimo index.html
});

//da lahko client dostopa do modulov
app.get('/socket.io.js', (req, res, next) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/socket.io-file-client.js', (req, res, next) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});

io.on('connection', (socket) => {
    try{
        var uploader = new SocketIOFile(socket, {
            uploadDir: 'data',
            chunkSize: 10240,       //1KB
            transmissionDelay: 0,
            overwrite: false
        });
        uploader.on('start', (fileInfo) => {
            console.log('Start uploading');
            console.log(fileInfo);
        });
        uploader.on('stream', (fileInfo) => {
            console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
        });
        /*uploader.on('complete', (fileInfo) => {
            console.log('Upload Complete.');
            console.log(fileInfo);
        });*/
        uploader.on('error', (err) => {
            console.log('Error!', err);
        });
        uploader.on('abort', (fileInfo) => {
            console.log('Aborted: ', fileInfo);
        });

        //p2p client
        socket.on('client', (msg) => {
            try{
                var secret;
                //connect
                var client_p2p_socket = client_p2p_io(`http://localhost:${msg}`);
                var client_p2p = new p2p(client_p2p_socket);

                client_p2p.emit('publicKey', key.client.getPublicKey());

                client_p2p.on('returnPublicKey', (msg) => {
                    console.log("PK received");
                    secret = key.client.computeSecret(msg, null, 'hex');
                    console.log(`Client secret: ${secret}`);
                    socket.emit('message', 'key successfully exchanged');
                });

                client_p2p.emit('message', 'joined');

                client_p2p.on('response', (msg) => {
                    console.log(msg);
                })

                uploader.on('complete', (fileInfo) => {
                    try{
                        console.log('Upload Complete.');
                        console.log(fileInfo);
                        var encryptedName = encryptFile(fileInfo.name, secret);
                        app.get('/' + encryptedName, (req, res) => {
                            res.sendFile(__dirname + '/encrypted/' + encryptedName);
                        });
                        console.log(encryptedName);
                        var file = {    //za datoteko naredimo objekt z imenom ter naslovom
                            filename: encryptedName,
                            link: `http://localhost:${port}/${encryptedName}`
                        }
                        client_p2p.emit('download', file);
                    } catch (e) {
                        console.log(`Error on uploader complete: ${e}`);
                    }  
                });

                socket.on('disconnect', () => {
                    io.emit('message', 'User disconnected');
                    client_p2p_socket.disconnect();
                    client_p2p.disconnect();
                })

            } catch (e) {
                console.log(`Error on socket p2p client: ${e}`);
            }            
        });

        //p2p server
        server_p2p_io.on('connection', (p2p_socket) => {
            try{
                socket.emit('message', 'Peer connected');
                console.log('Peer connected');

                p2p_socket.on('message', (msg) => {
                    socket.emit('message', msg);
                    p2p_socket.emit('response', 'Successfully connected');
                });

                p2p_socket.on('publicKey', (msg) => {
                    var secret = key.server.computeSecret(msg, null, 'hex');        //sporočilo pretvorimo v ključ
                    console.log(`Server secret: ${secret}`);
                    client_secrets.set(p2p_socket.id, secret);                  //vnesemo v map
                    p2p_socket.emit('returnPublicKey', key.server.getPublicKey())   //pošljemo public key
                });

                p2p_socket.on('download', file => {
                    file.socket_id = p2p_socket.id;
                    download(file.link, file.filename, client_secrets.get(file.socket_id), socket);
                });

                p2p_socket.on('disconnect', () => {
                    console.log('Peer disconnected');
                    socket.emit('message', 'Peer disconnected');
                });

            } catch (e) {
                console.log(`Error on server_p2p_io connection: ${e}`);
            }
        })

        socket.on('disconnect', () => {
            console.log("User disconnected");
            io.emit('message', 'User disconnected');
        });

    } catch (e) {
        console.log(`Error on io connection: ${e}`);
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});