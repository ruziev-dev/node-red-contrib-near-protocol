const { KeyPair, connect, InMemorySigner } = require("near-api-js");

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
  function ContractMethod(config) {
    try {
      RED.nodes.createNode(this, config);
      nodeConfig = config;
      node = this;
      nearConnectionCfg = near_config[config.network];
      console.log(JSON.stringify(config));

      initNearKeys().catch((error) => setError(error));

      node.on("input", onInputAction);
    } catch (error) {
      setError(error);
    }
  }
  RED.nodes.registerType("Contract Method", ContractMethod, {
    settings: {
      userPrivateKey: {
        exportable: false,
      },
    },
  });
};

const onInputAction = async (msg, send, done) => {
  try {
    initNearKeys();
    let near = await connect({ nearConnectionCfg });

    //const response = await near.connection.provider.experimental_genesisConfig();
    msg.payload = near;
    node.send(msg);
  } catch (error) {
    setError(error);
  }
};
const initNearKeys = async () => {
  keyPair = KeyPair.fromString(nodeConfig.userPrivateKey);
  signer = await InMemorySigner.fromKeyPair(
    nearConnectionCfg.networkId,
    nodeConfig.accountId,
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
