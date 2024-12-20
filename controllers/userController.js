const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Envoyer un e-mail de confirmation
    // sendEmail(
    //   email,
    //   "Confirmation d’inscription",
    //   "Cliquez sur ce lien pour confirmer votre e-mail."
    // );

    res
      .status(201)
      .json({
        message:
          "Utilisateur créé avec succès. Vérifiez votre e-mail pour confirmer.",
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetUserPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token });
    if (!user)
      return res.status(404).json({ error: "Token invalide ou expiré." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null; // Supprimer le token après réinitialisation
    await user.save();

    sendEmail(
      user.email,
      "Confirmation de changement de mot de passe",
      "Votre mot de passe a été modifié."
    );
    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userPasswordForgot = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    // Générer un token pour réinitialisation
    const resetToken = generateToken(); // Implémentez une fonction pour générer un token
    user.resetToken = resetToken;
    await user.save();

    sendEmail(
      email,
      "Réinitialisation de mot de passe",
      `Votre token : ${resetToken}`
    );
    res.json({ message: "Token envoyé à votre e-mail." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ error: "Mot de passe incorrect" });

    // Vérifier la confirmation de l'email
    if (!user.isVerified)
      return res
        .status(403)
        .json({
          error: "Veuillez vérifier votre e-mail avant de vous connecter.",
        });

    res.json({ message: "Connexion réussie", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateUserPreferences= async(userId, product) =>{
  const user = await User.findById(userId);

  // Ajouter la catégorie du produit aux préférences
  if (!user.preferences.categories.includes(product.category)) {
    user.preferences.categories.push(product.category);
  }

  // Ajouter aux produits récemment consultés (limité à 10 produits)
  user.preferences.recentlyViewed.unshift(product._id);
  if (user.preferences.recentlyViewed.length > 10) {
    user.preferences.recentlyViewed.pop();
  }

  await user.save();
}

  
module.exports = { getAllUsers, deleteUser, updateUser, registerUser, userLogin, resetUserPassword, userPasswordForgot,updateUserPreferences };
