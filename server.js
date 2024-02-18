const { Server } = require("net");

const hots = "0.0.0.0";
const END = "END";

const connetions = new Map();

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const sendMessage = (message, origin) => {
  //mandar mensaje a todos menos al origen
};

const listen = (port) => {
  const server = Server();

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    connetions.set(socket, "test");
    console.log(`new connetion from ${remoteSocket}`);
    socket.setEncoding("utf-8");

    socket.on("data", (message) => {
      if (connetions.has(socket)) {
        console.log(`Username ${message} set for connection ${remoteSocket}`);
        connetions.set(socket, message);
      } else if (message === END) {
        socket.end();
      } else {
        //enviar el mensaje al resto de clientes
        console.log(`${remoteSocket} -> ${message}`);
      }
    });
    socket.on("error", (err) => error(err.message));
    socket.on("close", () => {
      console.log(`Connection with ${remoteSocket} closed`);
    });
  });

  server.listen({ port, hots }, () => {
    console.log("servidor escuchando en el puerto: " + port );
  });

  server.on("error", (err) => error(err.message));
};

const main = () => {
  if (process.argv.length !== 3) {
    error(`Usage: node ${__filename} port`);
  }
  let port = process.argv[2];
  if (isNaN(port)) {
    error(`Ìnvalid port ${port}`);
  }

  port = Number(port);

  listen(port);
};
if (require.main === module) {
  main();
}
