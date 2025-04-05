const express = require("express");
const { PrismaClient } = require("@prisma/client");
const req = require("express/lib/request");

const app = express();
const prisma = new PrismaClient();

const PORT = 8080;

app.use(express.json());
app.use(express.static("public"));

app.get("/api", (req, res) => {
    res.json({ message: "API funcionando corretamente!" });
});

app.post("/api/v1/usuarios", async (req, res) => {
    const {
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

// app.post("/api/v1/conexao", async(data, response))
app.post("/api/v1/conexao", async (req, res) => {
    const {
        id_usuario_a,
        id_usuario_b
    } = req.body;

    const conexao = await prisma.conexao.create({
        data: {
            id_usuario_a,
            id_usuario_b
        }
    });

    console.log(conexao);
    res.status(201).json(conexao);
})

app.get("/api/v1/conexao", async (req, res) => {
    const conexao = await prisma.conexao.findMany();
    res.status(200).json(conexao);
})
// data: JSON.stringify({ id_partida, id_usuario, area_jogada,peca_do_jogador }),

app.post("/api/v1/partidaHistorico", async (req, res) => {
    const {
        id_partida,
        id_usuario,
        area_jogada,
        peca_do_jogador
    } = req.body;

    const ultimaJogada = await prisma.partida_historico.findFirst({
        where: { id_partida },
        orderBy: { id: 'desc' },
    });

    const localOcupado = await prisma.partida_historico.findFirst({
        where: {
            area_jogada,
            id_partida
        }
    })

    if(ultimaJogada['id_usuario'] == id_usuario){
        res.status(422).json('Não é sua vez de jogar');
    }
    else if(localOcupado != null){
        res.status(422).json('Posição ja ocupada');
    }
    else{
        const partida_historico = await prisma.partida_historico.create({
            data: {
                id_partida,
                id_usuario,
                area_jogada,
                peca_do_jogador
            }
        });

        res.status(201).json(partida_historico);
    }
});

app.post('/api/v1/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email, senha } });

    if (usuario == null) {
        return res.status(401).json({ error: "Credenciais Inválidas" });
    }
    else {
        return res.status(200).json(usuario);
    }
})


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
