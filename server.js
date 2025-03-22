const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const PORT = 8080;


app.use(express.static("public"));

app.get("/api", (req, res) => {
    res.json({ message: "API funcionando corretamente!" });
});

app.post("/api/v1/usuarios", async (req, res) =>{
    const   {
                nome, 
                email, 
                senha, 
                username, 
                avatar
            } = req.body;

    const usuario = await prisma.usuario.create({
        data: {
            nome, 
            email, 
            senha, 
            username, 
            avatar
        }        
    });

    res.status(201).json(usuario);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
