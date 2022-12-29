const { connect, utils } = require("near-api-js");

module.exports = async function (node, config) {
  let errors = [];
  const _lib = this;

  _lib.sender = function (msgs) {
    console.log("No sender set!");
  };

  const NEAR = await connect({
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
  });

  if (typeof node == "undefined" || node == null) {
    node = {
      status: function () {},
      send: function (msgs) {
        _lib.sender(msgs);
      },
      contract: {},
      context: function () {
        const persist = require("node-persist");
        return {
          get: async function (key) {
            if (typeof persist.values == "undefined") await persist.init();
            return await persist.getItem(key);
          },
          set: async function (key, value) {
            if (typeof persist.values == "undefined") await persist.init();
            return await persist.setItem(key, value);
          },
        };
      },
    };
    if (typeof config !== "undefined" && config !== null) {
      if (typeof config.connection !== "undefined")
        node.connection = config.connection;
      if (typeof config.contract !== "undefined")
        node.contract = config.contract;
    }
  }
  if (typeof config == "undefined" || config == null) {
    config = {};
  }
  const storage = node.context();

  this.initFinished = false;

  async function load(msg) {
    if (_lib.initFinished) return;
    else {
      _lib.initFinished = true;
      let keys = await storage.get("keys");

      /* if (
        typeof keys !== "undefined" &&
        keys !== null &&
        typeof config.rapidAPIkey !== "undefined" &&
        config.rapidAPIkey !== null &&
        config.rapidAPIkey.length > 10
      ) {
        const Cloudwallet = require("cloudwallet");
        const cloudwallet = new Cloudwallet(
          config.rapidAPIkey,
          keys.privateKey,
          keys.identifier
        );
        let presentations = await cloudwallet.get("presentations");
        if (typeof presentations !== "undefined" && presentations !== null) {
          await storage.set("presentations", presentations);
        }
      } */
    }
  }

  async function input(msg) {
    let privateKey = node.connection.privateKey;
    let contractAddress = node.contract.address;
    let abi = node.contract.ABI;
    let rpcUrl = node.connection.rpcUrl;
    let keys = {};

    if (config.AllowInject) {
      if (typeof msg.payload !== "undefined" && msg.payload !== null) {
        if (typeof msg.payload.privateKey !== "undefined")
          privateKey = msg.payload.privateKey;
        if (typeof msg.payload.contract !== "undefined")
          contractAddress = msg.payload.contract;
        if (typeof msg.payload.abi !== "undefined") abi = msg.payload.abi;
        if (typeof msg.payload.rpcUrl !== "undefined")
          rpcUrl = msg.payload.rpcUrl;
      }
    }

    // tiny Key-Management
    if (
      typeof privateKey == "undefined" ||
      privateKey == null ||
      privateKey.length !== 66
    ) {
      let keypair = await storage.get("keys");
      if (typeof keypair == "undefined" || keypair == null) {
        keypair = EthrDID.createKeyPair();
        keypair.id = "did:ethr:" + keypair.identifier;
        await storage.set("keys", keypair);
      }
      privateKey = keypair.privateKey;
      keys = keypair;
    }

    return {
      input: input,
      load: load,
      errors: errors,
      setSender: function (fct) {
        _lib.sender = fct;
      },
    };
  }
};
