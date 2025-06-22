"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "./SignInForm.module.css"; // Import CSS module

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/sign-in", { username, password });
      const token = res.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        setError("Erreur de connexion : Token manquant");
      }
    } catch (err) {
      setError("Identifiants invalides. Veuillez réessayer.");
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
        <h2 className={styles.title}>Connexion</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Se connecter
          </button>
        </form>
        <p className={styles.textCenter}>
          Pas encore inscrit ?{" "}
          <Link href="/register" className={styles.link}>
            Créez un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
