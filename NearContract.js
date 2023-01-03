const { KeyPair, InMemorySigner } = require("near-api-js");
const { CONTEXT_NAME } = require("./config.js");

const near_config = {
  testnet: {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
  },
  mainnet: {
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
  },
};

let nodeConfig;
let node;
let keyPair;
let nearConnectionCfg;
let signer;

module.exports = function (RED) {
  function NearContract(config) {
    try {
      RED.nodes.createNode(this, config);

      nodeConfig = config;
      node = this;
      nearConnectionCfg = near_config[config.network];

      const flowContext = this.context().flow;
      let NearContexts = flowContext.get(CONTEXT_NAME);

      if (!NearContexts) NearContexts = new Map();
      NearContexts.set(config.id, config);
      flowContext.set(CONTEXT_NAME, NearContexts);

      initNearKeys().catch((error) => setError(error));
    } catch (error) {
      setError(error);
    }
  }
  RED.nodes.registerType("Near Contract", NearContract, {
    credentials: {
      userPrivateKey: { type: "password" },
    },
  });
};

const initNearKeys = async () => {
  keyPair = KeyPair.fromString(node.credentials?.userPrivateKey);
  signer = await InMemorySigner.fromKeyPair(
    nearConnectionCfg.networkId,
    node.accountId,
    keyPair
  );
  node.status({
    fill: "green",
    shape: "dot",
    text: nodeConfig.accountId,
  });
};

const setError = (error) => {
  node.error(error);
  node.trace(error);
  node.status({ fill: "red", shape: "dot", text: error.message });
};
