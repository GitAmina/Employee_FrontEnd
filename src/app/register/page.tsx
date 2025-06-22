"use client";

import React, { useState } from "react";
import publicApi from "@/lib/axiosPublic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SignUpForm.module.css";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await publicApi.post("/sign-up", {
        username,
        email,
        password,
      });

      const message = response.data.message || "Inscription réussie !";
      const name = response.data.username || username;

      setSuccess(` ${message} Bienvenue ${name} !`);

      // Réinitialiser les champs
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirection après 2 secondes
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      console.error("Erreur complète :", err);

      const backendMessage =
        err?.response?.data?.error || "Erreur lors de l’inscription";

      setError(` ${backendMessage}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["image-container"]}>
        <img
          src="/images/user/1.png"
          alt="Gestion Bureau d'Ordre"
          className={styles["login-image"]}
        />
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Inscription</h1>

        {error && <p className={styles.messageError}>{error}</p>}
        {success && <p className={styles.messageSuccess}>{success}</p>}

        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            S’inscrire
          </button>
        </form>

        <p className={styles.textCenter}>
          Déjà un compte ?{" "}
          <Link href="/login" className={styles.link}>
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
