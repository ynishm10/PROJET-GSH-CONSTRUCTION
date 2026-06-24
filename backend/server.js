require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Backend qui possède 1 endpoint (/contact), qui permet de configurer 
 * une connexion SMPT sur un compte gmail, et d'envoyer un email à partir
 * de ton adresse email, vers l'adresse email que tu saisies dans 
 * le formulaire avec les données.
 */

app.post("/contact", async (req, res) => {
  const { name, email, phone, service, address, message } = req.body;

  // faire attention à cette partie, il faut bien te renseigner
  try {
        const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // il te faut impérativement un compte gmail
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // récupération depuis le fichier .env
            pass: process.env.EMAIL_PASS  // récupération depuis le fichier .env
        },
        tls: {
            rejectUnauthorized: false
        }
        });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `"Nouveau message de ${name}"`,  // changer le texte du mail ici
      text: message,
      html: `
        <h3>Nouveau message</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Service souhaité :</strong> ${service}</p>
        <p><strong>Adresse :</strong> ${address}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `
    });

    res.json({ success: true, message: "Email envoyé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`);
});