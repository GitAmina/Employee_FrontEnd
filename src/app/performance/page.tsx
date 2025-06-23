// src/app/performance/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import performanceApi from "@/lib/axios-performance";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function PerformanceReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState("");
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");
  const [reviewDate, setReviewDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Récupérer toutes les reviews
  const fetchReviews = async () => {
    try {
      const response = await performanceApi.get("/");
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      toast.error("Erreur lors du chargement des évaluations");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Créer une nouvelle review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newReview = {
        employeeId: Number(employeeId),
        score: Number(score),
        comments,
        reviewDate,
      };

      const response = await performanceApi.post("/", newReview);
      // @ts-ignore
      setReviews([...reviews, response.data]);
      toast.success("Évaluation ajoutée avec succès");

      // Réinitialiser le formulaire
      setEmployeeId("");
      setScore("");
      setComments("");
      setReviewDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      toast.error("Erreur lors de l'ajout de l'évaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer une review
  const handleDelete = async (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette évaluation ?")
    ) {
      try {
        await performanceApi.delete(`/${id}`);
        setReviews(
          reviews.filter(
            (review) =>
              // @ts-ignore
              review.id !== id,
          ),
        );
        toast.success("Évaluation supprimée avec succès");
      } catch (err) {
        toast.error("Erreur lors de la suppression de l'évaluation");
      }
    }
  };

  return (
    <DefaultLayout>
      <ToastContainer position="top-right" autoClose={5000} />
      <Breadcrumb pageName="Évaluations" />

      <div className="grid grid-cols-1 gap-9">
        {/* Formulaire d'ajout */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-1">
          <h3 className="mb-6 text-xl font-semibold text-black">
            Ajouter une évaluation
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Employé
                </label>
                <input
                  type="number"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Score
                </label>
                <select
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                >
                  <option value="">Sélectionner</option>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "En cours..." : "Ajouter"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Commentaires
              </label>
              <textarea
                className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Liste des évaluations */}
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-1">
          <div className="max-w-full overflow-x-auto">
            {loading ? (
              <div className="py-4 text-center">Chargement en cours...</div>
            ) : reviews.length === 0 ? (
              <div className="py-4 text-center">
                Aucune évaluation disponible
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                    <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                      Employé
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                      Score
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Date
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Commentaires
                    </th>
                    <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    // @ts-ignore
                    <tr key={review.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === reviews.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <h5 className="text-dark dark:text-white">
                          Employé #
                          {
                            // @ts-ignore
                            review.employeeId
                          }
                        </h5>
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === reviews.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p
                          className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                            // @ts-ignore
                            review.score >= 80
                              ? "bg-[#219653]/[0.08] text-[#219653]"
                              : // @ts-ignore
                                review.score >= 50
                                ? "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                                : "bg-[#D34053]/[0.08] text-[#D34053]"
                          }`}
                        >
                          {
                            // @ts-ignore
                            review.score
                          }
                          /100
                        </p>
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === reviews.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {
                          // @ts-ignore
                          new Date(review.reviewDate).toLocaleDateString(
                            "fr-FR",
                          )
                        }
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === reviews.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {
                            // @ts-ignore
                            review.comments || "Aucun commentaire"
                          }
                        </p>
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === reviews.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center justify-end space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              // Pré-remplir le formulaire pour modification
                              setEmployeeId(
                                // @ts-ignore
                                review.employeeId.toString(),
                              );
                              setScore(
                                // @ts-ignore
                                review.score.toString(),
                              );
                              setComments(
                                // @ts-ignore
                                review.comments,
                              );
                              setReviewDate(
                                // @ts-ignore
                                review.reviewDate,
                              );

                              // Supprimer l'évaluation existante si modification réussie
                              handleDelete(
                                // @ts-ignore
                                review.id,
                              );
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button
                            className="hover:text-primary"
                            onClick={() =>
                              handleDelete(
                                // @ts-ignore
                                review.id,
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
