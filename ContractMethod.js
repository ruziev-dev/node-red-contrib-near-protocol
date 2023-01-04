const { NEAR_CONTRACT_CONTEXT } = require("./config.js");

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
      }

      async function handleInput(msg, send, done) {
        try {
          const flowContext = node.context().flow;
          const nearContracts = flowContext.get(NEAR_CONTRACT_CONTEXT);
          const contract = nearContracts.get(config.contract);
          node.status({
            fill: "green",
            shape: "dot",
            text: "Processing...",
          });

          if (!contract)
            throw new Error(
              `Contract has been setted with some errors and it was not found`
            );

          const result = await contract[config.method](msg.payload);

          send({ payload: result || "completed" });
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
