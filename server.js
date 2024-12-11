import express from 'express';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); 

const users = [];

app.post('/usuarios', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age,
            },
        });
        users.push(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao criar usuário' });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany(); 
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao buscar usuários' });
    }
});

// Rota para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { email, name, age } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email, name, age },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao atualizar o usuário' });
    }
});

// Rota para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        await prisma.user.delete({
            where: { id: userId },
        });

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao deletar o usuário' });
    }
});

// Busca usuários com base em filtros dinâmicos
app.get('/usuarios/filtro', async (req, res) => {
    const { email, name, minAge, maxAge } = req.query; // Filtros enviados como query params

    try {
        const users = await prisma.user.findMany({
            where: {
                email: email ? { contains: email } : undefined, // Filtro por email (contém)
                name: name ? { contains: name } : undefined,    // Filtro por nome (contém)
                age: {
                    gte: minAge ? parseInt(minAge, 10) : undefined, // Idade mínima
                    lte: maxAge ? parseInt(maxAge, 10) : undefined, // Idade máxima
                },
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários com filtros' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
