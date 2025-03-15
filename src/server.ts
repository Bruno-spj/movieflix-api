import express from "express";

const port = 3000;
const app = express();
app.get("/movies", (req, res) => {
  res.send("Listagem de Filmes");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
