const { KeyPair, utils, connect } = require("near-api-js");

const near_config = {
  testnet: {
    networkId: "testnet",
  },
  mainnet: {
    networkId: "mainnet",
  },
};

module.exports = function (RED) {
  function NearContract(config) {
    try {
      RED.nodes.createNode(this, config);

      let keyPair = KeyPair.fromString(config.userPrivateKey);
      const publicKey = keyPair.getPublicKey().toString();
      console.log("publicKey: ", publicKey);
      this.status({
        fill: "green",
        shape: "dot",
        text: publicKey.slice(0, 20) + "...",
      });

      let nearConfig = near_config[config.network];

      var node = this;
      node.on("input", async function (msg, send, done) {
        connect({ nearConfig });
        node.send(msg);
      });
    } catch (error) {
      this.status({ fill: "red", shape: "dot", text: error.message });
    }
  }
  RED.nodes.registerType("NearContract", NearContract);
};
