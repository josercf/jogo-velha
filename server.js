require('dotenv').config();  
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

//TODO: 1.a Criar um endpoint para retornar a partida com status criado.
app.get("/api/v1/partida/em-andamento", async (req, res) => {
    const partida = await prisma.conexao.findMany({
        where: {
            status: 'criado'
        }
    });
    res.status(200).json(partida);
});

//TODO: 1.b Criar um endpoint para realizar a criação de uma partida.
app.post("/api/v1/partida", async (req, res) => {
    const {
        id_usuario        
    } = req.body;

    const partida = await prisma.conexao.create({
        data: {
            id_usuario_a: id_usuario,
            id_usuario_b : null,
            status: 'criado'
        }
    });

    res.status(201).json(partida);
});

//TODO: 1.c Criar um endpoint para ingressar o usuário b na partida. 
//Deverá receber o id da partida e o id do usuário. Fazer um update dos campos id_usuario_b e statius para 'andamento'.
app.put("/api/v1/partida/:id_partida", async (req, res) => {
    const { id_partida } = req.params;
    const { id_usuario_b } = req.body;

    const partida = await prisma.conexao.update({
        where: { id: Number(id_partida) },
        data: {
            id_usuario_b,
            status: 'andamento'
        }
    });

    res.status(200).json(partida);
});


//TODO: 1.d Criar um endpoint que recebe o id_parida e retorna a última jogada registrada no historico da partida.
app.get("/api/v1/partida/:id_partida/historico", async (req, res) => {
    const { id_partida } = req.params;

    const partida_historico = await prisma.partida_historico.findMany({
        where: { id_partida },
        orderBy: { id: 'desc' },
        take: 1
    });

    res.status(200).json(partida_historico);
});



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

//criar um endpoint get que retornar os dados do usuario por meio do id
app.get('/api/v1/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) }
    });

    if (usuario == null) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

      const response = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            username: usuario.username,
            avatar: usuario.avatar
        };
    return res.status(200).json(response);
});

app.post('/api/v1/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email, senha } });

    if (usuario == null) {
        return res.status(401).json({ error: "Credenciais Inválidas" });
    }
    else {
        const response = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            username: usuario.username,
            avatar: usuario.avatar
        };
        return res.status(200).json(response);
    }
})


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
