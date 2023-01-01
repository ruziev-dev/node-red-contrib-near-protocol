const {} = require("near-api-js");

let nodeConfig;
let node;
let keyPair;
let signer;

module.exports = function (RED) {
  function ContractMethod(config) {
    try {
      RED.nodes.createNode(this, config);
      nodeConfig = config;
      node = this;

      node.on("input", onInputAction);
    } catch (error) {
      setError(error);
    }
  }
  RED.nodes.registerType("Contract Method", ContractMethod);
};

const onInputAction = async (msg, send, done) => {
  try {
    node.send(msg);
  } catch (error) {
    setError(error);
  }
};

const setError = (error) => {
  node.error(error);
  node.trace(error);
  node.status({ fill: "red", shape: "dot", text: error.message });
};
