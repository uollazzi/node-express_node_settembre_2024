import express, { Request, Response } from "express";

const port = 3000;
const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Ciao!</h1>");
});

app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
    console.log("Premere CTRL+C per arrestare.")
})