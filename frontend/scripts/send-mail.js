/**
* Fichier qui permet de récupèrer les données du formulaire 
* et de les envoyer au backend.
*/

PORT = 3000 // port sur lequel tourne le backend
BACKEND_URL = `http://localhost:${PORT}` // url du backend
BACKEND_ENDPOINT = "/contact" // endpoint pour appeler le backend, qui envoie le mail

document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // récupèration des données envoyées depuis le formulaire.
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    service: document.getElementById("service").value,
    address: document.getElementById("address").value,
    message: document.getElementById("message").value
  };

  const url = `${BACKEND_URL}${BACKEND_ENDPOINT}`
  console.log(url);
  const response = await fetch(url, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  let result = null;
  try {
    result = await response.json();
  } catch (err) {
    // Si le backend ne renvoie pas de JSON
    result = { success: false, error: `Réponse non-JSON (status: ${response.status})` };
  }

  document.getElementById("status").innerText =
    result && result.success
      ? "Message envoyé avec succès !"
      : `Erreur lors de l'envoi${result && result.error ? `: ${result.error}` : ''}`;
});
