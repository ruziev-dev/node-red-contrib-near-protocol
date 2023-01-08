const { NEAR_CONTRACT_CONTEXT } = require("./config.js");
const fetch = require("node-fetch");

const contractContextFoundInMethods = new Map();

module.exports = function (RED) {
  function ContractMethod(config) {
    try {
      RED.nodes.createNode(this, config);
      const node = this;

      function setError(error) {
        node.error(error.message);
        node.trace(error);
        node.status({
          fill: "red",
          shape: "dot",
          text: error.message?.split(".")?.[0],
        });
        setTimeout(() => {
          node.status({});
        }, 5000);
      }

      const flowContext = node.context().flow;
      const nearContracts = flowContext?.get(NEAR_CONTRACT_CONTEXT);
      const contract = nearContracts?.get(config.contract);

      // If contract doesn't exist in flow context it may be reloaded to fix or contract settings is not correct
      if (!contract)
        if (contractContextFoundInMethods.get(config.id))
          throw Error(
            "Contract has been setted with some errors and it was not found"
          );
        else {
          contractContextFoundInMethods.set(config.id, true);
          fetch("http:127.0.0.1:1880/flows", {
            method: "POST",
            headers: {
              "Node-RED-Deployment-Type": "reload",
            },
          }).catch((error) => setError(error));
        }

      async function handleInput(msg, send, done) {
        try {
          node.status({
            fill: "blue",
            shape: "dot",
            text: "Processing...",
          });

          const result = await contract[config.method](msg.payload);

          msg.payload = result || {};
          send(msg);
          node.status({});
          if (done) {
            done();
          }
        } catch (error) {
          setError(error);
        }
      }

      node.on("input", handleInput);
    } catch (error) {
      setError(error);
    }
  }
  RED.nodes.registerType("Contract Method", ContractMethod);
};
