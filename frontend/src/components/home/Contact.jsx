import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback("📧 Votre message a été envoyé !");
        setNom("");
        setEmail("");
        setMessage("");
      } else {
        setFeedback(data.error || "Erreur lors de l'envoi du message.");
      }
    } catch (err) {
      console.error(err);
      setFeedback("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <Input
        type="text"
        placeholder="Votre nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        placeholder="Votre message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={5}
      />
      {feedback && (
        <p
          className={`text-sm ${
            feedback.includes("📧") ? "text-green-700" : "text-red-700"
          }`}
        >
          {feedback}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </motion.form>
  );
}
