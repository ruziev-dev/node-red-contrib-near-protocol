module.exports = function (RED) {
  function Contract(config) {
    RED.log("config: ", config);
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", function (msg) {
      msg.payload = msg.payload.toLowerCase();
      const transaction = 12;
      node.send([msg, transaction]);
    });
  }
  RED.nodes.registerType("Contract", Contract);
};
