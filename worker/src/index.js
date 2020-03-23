import server from "./server";

const [port_arg] = process.argv.filter(arg => arg.match("port="));

let PORT = 4444;

if (port_arg) {
  PORT = port_arg.replace(/\D/g, "");
}

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
