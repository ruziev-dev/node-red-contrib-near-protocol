const { Contract, utils, keyStores, connect } = require("near-api-js");
const { NEAR_CONTRACT_CONTEXT } = require("./config.js");

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

module.exports = function (RED) {
  function NearContract(config) {
    RED.nodes.createNode(this, config);

    const node = this;
    const nearConnectionCfg = near_config[config.network];

    function setError(error) {
      node.error(error);
      node.trace(error);
      node.status({ fill: "red", shape: "dot", text: error.message });
    }
    try {
      if (!node.credentials.userPrivateKey)
        throw Error("Private key is not filled in");

      const flowContext = this.context().flow;
      let nearContracts = flowContext.get(NEAR_CONTRACT_CONTEXT);

      if (!nearContracts) nearContracts = new Map();

      async function initNearContext() {
        const keyPair = utils.KeyPair.fromString(
          node.credentials.userPrivateKey
        );
        const keyStore = new keyStores.InMemoryKeyStore();
        keyStore.setKey(nearConnectionCfg.networkId, config.accountId, keyPair);

        const connectionConfig = {
          keyStore,
          ...nearConnectionCfg,
        };

        const near = await connect(connectionConfig);

        const NearAccount = await near.account(config.accountId);

        const contractMethods = {
          changeMethods:
            config.methods
              ?.filter((method) => method.type === "call")
              ?.map((method) => method.name) || [],

          viewMethods:
            config.methods
              ?.filter((method) => method.type === "view")
              ?.map((method) => method.name) || [],
        };

        const NearContract = new Contract(
          NearAccount,
          config.contract,
          contractMethods
        );
        return NearContract;
      }

      initNearContext()
        .then((contractContext) => {
          nearContracts.set(config.id, contractContext);
          flowContext.set(NEAR_CONTRACT_CONTEXT, nearContracts);

          node.status({
            fill: "green",
            shape: "dot",
            text: config.accountId,
          });
        })
        .catch((error) => setError(error));
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
