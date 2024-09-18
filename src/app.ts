import express, { Request, Response, NextFunction } from "express";
import { DateTime } from "luxon";
import articoli from "./data";

const port = 3000;
const app = express();

// configurazione template engine
app.set("views", "./src/views");
app.set("view engine", "hbs");

app.use((req: Request, res: Response, next: NextFunction) => {
    const adesso = DateTime.local();
    console.log("LOG:", req.method, req.url, adesso.toFormat("dd/MM/yyyy HH:mm:ss"));

    if (adesso.hour == 22) {
        res.send("<h1>Tra le 19 e le 20 siamo chiusi. Provare più tardi.</h1>");
    } else {
        next();
    }
});

// middleware file statici
app.use(express.static("./public"));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.render("index", { pageTitle: "Home Page", nome: "Gigi" });
});

app.get("/chi-siamo", (req: Request, res: Response) => {
    res.render("chi-siamo", { pageTitle: "Siamo solo noi" });
});

app.get("/contatti", (req: Request, res: Response) => {
    res.render("scrivici", { pageTitle: "Contatti" });
});

app.get("/articoli", (req: Request, res: Response) => {
    // qui ci sarà la chiamata al database tipo: db.getPosts()

    res.render("articoli", {
        pageTitle: "Elenco Articoli",
        articoli: articoli
    });
});

app.get("/articolo/:id", (req: Request, res: Response) => {
    const id = req.params["id"];
    const idNumber = Number(id);

    // qui ci sarà la chiamata al database tipo: db.getPostById(id)
    const articolo = articoli.find(x => x.id == idNumber);

    if (!articolo) {
        res.status(404).send("Articolo non trovato.");
        return;
    }

    res.render("articolo", {
        pageTitle: "Elenco Articoli",
        articolo: articolo
    });

    // Pattern MVC
});

app.get("/benvenuto", (req: Request, res: Response) => {
    res.send("<h1>Benvenuto!</h1>");
});

app.get("/api/pippo", (req: Request, res: Response) => {
    res.json({ nome: "Pippo", anni: 34 });
});

app.get("/errore", (req: Request, res: Response) => {
    throw new Error("Database irragiungibile.");
});

// 404 - ultimo middleware della pipeline
app.use((req: Request, res: Response) => {
    res.status(404).send("Pagina non trovata.");
})

// 500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(500).send("Ops, qualcosa è andato storto: " + err.message);
});

// app.get("/style.css", (req: Request, res: Response) => {
//     // cercare sul server un file che si chiama style.css e ritornarlo al clien così com'è
// });

// GET      /
// GET      /benvenuto
// POST     /benvenuto

app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
    console.log("Premere CTRL+C per arrestare.")
});