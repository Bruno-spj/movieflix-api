import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

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

app.post("/movies", async (req, res) => {
  const movies = await prisma.movie.create({
    data: {
      title: "A Paixão de Cristo",
      genre_id: 4,
      language_id: 2,
      oscar_count: 3,
      release_date: new Date(2004, 2, 19),
    },
  });
  res.status(201).json(movies);
});

app.delete("/movies", async (req, res) =>{
  const deleteMovie = await prisma.movie.delete({
    where: {
      id: 12,
    },
  })
  res.status(500).json()
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
