// Importation du package jsonwebtoken pour manipuler les tokens JWT
import jwt from 'jsonwebtoken';

// Récupération de la clé secrète pour vérifier les tokens JWT, 
// soit à partir des variables d'environnement, soit une valeur par défaut 'your_jwt_secret'
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

// Exportation du middleware 'authenticateToken'
export const authenticateToken = (req, res, next) => {
    // Affichage de l'en-tête d'autorisation pour le débogage
    console.log("Authorization Header:", req.headers.authorization);

    // Extraction du token JWT de l'en-tête d'autorisation
    // L'en-tête est généralement sous la forme 'Bearer [token]', donc on divise la chaîne
    // et on récupère la deuxième partie (le token lui-même)
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    // Si aucun token n'est fourni, renvoyer une erreur 403 (Forbidden)
    if (!token) return res.status(403).json({ message: 'Token requis' });
    
    // Vérification de la validité du token
    jwt.verify(token, secret, (err, user) => {
        // Si une erreur survient lors de la vérification (token invalide ou expiré),
        // renvoyer une erreur 403
        if (err) {
            return res.status(403).json({ message: 'Token invalide ou expiré' });
        }

        // Si le token est valide, attacher les informations de l'utilisateur à la requête
        // Cela permettra aux routes suivantes d'accéder aux informations de l'utilisateur
        req.user = user;

        // Passer à la prochaine fonction middleware dans la pile
        next();
    });
};

export const auth = authenticateToken;