const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "045d11541b9c939655d887fb4ae7c89e9f27d514225ded99f3b09bbf0ba1aaf1a1d97b83a515e553a4514fd24fa8730c729745578a92b4c1f4c0a7599e2a2292e5": 100, // dan
  "048dbfca1b9acd41b34c7aee4507f67791bcc069a2a2c8b9c31d2cf3657607d00c60e64bcde628e736cfd7451a38b5b682c4cac0149f1d96f8eb380d20f71d77e1": 50, // al
  "04148559b4bdcf15a98c8c9e06dc5294dcd1c02eaaf97e1a9edb118ab257d3d3e21e36a392bcc0a3bd9052e7368c1fafbae18d34e5c897d1c77ea87c41a5c9a62e": 75, // ben
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client-side application
  //recover the public address from the signature

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
