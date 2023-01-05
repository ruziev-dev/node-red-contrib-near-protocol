# node-red-near-protocol

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
![NPM version](https://badge.fury.io/js/node-red-near-protocol.svg)
![NPM](https://img.shields.io/npm/l/node-red-near-protocol)

This module provides nodes to call smart-contract methods from

![](./assets/_pallets.png)

## Add NEAR Protocol to your automation Node-RED Project.

### Install

To install the stable version use the `Menu` - `Manage palette` option and search for `node-red-near-protocol`, or run the following command in your Node-RED user directory - typically ~/.node-red:

```bash
npm i node-red-near-protocol
```

### Create your first flow

1. Add `Near Contract` node to workspase

   ![](./assets/1_0_add_Near_Contract_to_flow.png)

2. Double click it and configure contract.

   ![](./assets/1_1_configure_Near_Contract_start.png)

3. Set values to fields, fill in contract methods and press `Done`

   ![](./assets/1_3_configure_Near_Contract_finish.png)

<details><summary>How to get your private key?</summary>
<li>Near Wallet
<p>
Open Browser DevTools go to tab <code>Application</code>, open <code>Local Storage</code> and find private key.
</p>
<img src="./assets/1_2_get_private_key_from_near_wallet.png">
</li>
<li>
Another wallet
<p>
Go to <code>Settings</code> - <code>Backup Account</code> Choose export method <code>Private Key</code>
</p>
</details>

4. Press `Deploy` button. After succesful flow deploy you have to see similar contract node or error message.

   ![](./assets/1_4_configure_Near_Contract_deploy_result.png)

5. Add `Contract Method` node to workspase

   ![](./assets/2_0_add_Contract_Method_to_flow.png)

6. Double click it and configure method. Choose created before contract and method and press `Done`

   ![](./assets/2_1_configure_Contract_Method.png)

7. Method node has to change label

   ![](./assets/2_2_configure_Contract_Method_result.png)

8. To call contract we have to emit some event and pass some arguments. To do it let't add standard `inject` node to a workspace.

   ![](./assets/3_0_add_inject_node_to_flow.png)

9. Set arguments to `payload` field and press `Done`

   ![](./assets/3_1_configure_inject_node.png)

10. Add standart `debug` node to show result in debug console, connect nodes inputs and outputs and press `Deploy`. After that you can run contract by pressing to button on `inject` node.

    ![](./assets/_execution.png)

    Execution error will be displayed in debug console and as a contract node status

    ![](./assets/_execution_error.png)

    Execution succes result will be transmitted to next node. If contract call does not return any result next node will get `{ payload: "completed" }`
    ![](./assets/_completed.png)
