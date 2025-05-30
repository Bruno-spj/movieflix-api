import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocumnet from "../swagger.json"

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumnet))

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

app.put("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return res.status(404).send({ message: "Filme não encontrado" });
    }

    const data = { ...req.body };
    data.release_date = data.release_date
      ? new Date(data.release_date)
      : undefined;

    await prisma.movie.update({ where: { id }, data });

    res.status(200).send({ message: "Filme atualizado com sucesso" });
  } catch (error) {
    res.status(500).send({ message: "Falha ao atualizar o registro do Filme" });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      return res.status(404).send({ message: "Filme não encontrado" });
    }
    await prisma.movie.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "Falha ao remover o filme" });
  }
  res.status(200).send({ message: "Filme removido com sucesso" });
});

app.get("/movies/:genreName", async (req, res) => {
  console.log(req.params.genreName);

  try {
    const moviesFilteredByGenderName = await prisma.movie.findMany({
      where: {
        genres: {
          name: {
            equals: req.params.genreName,
            mode: "insensitive",
          },
        },
      },
      include: {
        genres: true,
        languages: true,
      },
    });
    res.status(200).send(moviesFilteredByGenderName);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Falha ao filtrar filme por gênero" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
