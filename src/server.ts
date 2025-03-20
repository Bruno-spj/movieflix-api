import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (req, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: "asc",
    },
    include: {
      genres: true,
      languages: true,
    },
  });
  res.json(movies);
});

app.use(express.json());
app.post("/movies", async (req, res) => {
  const { title, genre_id, language_id, oscar_count, release_date } = req.body;

  // Verifica se já existe um filme com o mesmo título
  const existingMovie = await prisma.movie.findFirst({
    where: {
      title: { equals: title, mode: "insensitive" },
    },
  });

  if (existingMovie) {
    return res
      .status(409)
      .json({ message: "Já existe um filme com esse título." });
  }

  // Criação do novo filme caso não exista duplicação
  const movie = await prisma.movie.create({
    data: {
      title,
      genre_id,
      language_id,
      oscar_count,
      release_date: new Date(release_date),
    },
  });

  res.status(201).json(movie);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
