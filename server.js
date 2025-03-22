const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.static("public"));

app.get("/api", (req, res) => {
    res.json({ message: "API funcionando corretamente!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
