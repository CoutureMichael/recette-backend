import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js"; // Connexion Sequelize
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

// Charger les variables d'environnement (.env)
dotenv.config();


//  Initialisation d'Express

const app = express();


//  Middlewares globaux


// Permet les requêtes entre ton front (Render) et ton back (Render ou localhost)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // autorise ton front local ou Render
  credentials: true, // si tu veux envoyer cookies/tokens
}));

// Permet de lire les données JSON dans les requêtes POST
app.use(express.json());


// Routes principales


// Route de test (accueil)
app.get("/", (req, res) => {
  res.json({ message: "Recette API OK ✅" });
});

// Routes utilisateurs (inscription / connexion)
app.use("/api/users", userRoutes);

// Routes recettes protégées par JWT
app.use("/api/recipes", recipeRoutes);


// Middleware de gestion d’erreurs

app.use((err, req, res, next) => {
  console.error("❌ Erreur :", err);
  res.status(500).json({ message: err.message || "Erreur serveur interne" });
});


// Connexion à la base de données

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion MySQL réussie !");

    // Synchronise les modèles avec la base (crée les tables si non existantes)
    await sequelize.sync(); // { alter: true } si tu veux maj auto la structure
    console.log("Tables synchronisées");

   
    //  Lancement du serveur
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Serveur démarré sur le port ${PORT}`)
    );
  } catch (error) {
    console.error("Erreur de connexion MySQL :", error.message);
  }
})();