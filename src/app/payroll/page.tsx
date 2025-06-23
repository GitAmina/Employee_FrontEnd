// src/app/payroll/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import payrollApi from "@/lib/axios-payroll";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import axios from "axios";

interface Payroll {
  id: number;
  employeeId: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: "",
    baseSalary: "",
    bonus: "",
    deductions: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const fetchPayrolls = async () => {
    try {
      // Solution temporaire pour le développement - à ne pas utiliser en production
      const response = await axios.get("http://localhost:8083/api/payroll/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        transformRequest: [
          (data, headers) => {
            // Transformation spécifique pour éviter les problèmes CORS
            if (headers) {
              delete headers.common["X-Requested-With"];
            }
            return data;
          },
        ],
      });

      setPayrolls(response.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      if (error.response) {
        // Erreur venue du serveur
        if (error.response.status === 401) {
          toast.error("Session expirée - Veuillez vous reconnecter");
          localStorage.removeItem("token");
          // @ts-ignore
          router.push("/login");
        } else {
          toast.error(
            `Erreur serveur: ${error.response.data.message || error.response.statusText}`,
          );
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse reçue
        if (error.code === "ERR_NETWORK") {
          toast.error("Problème de connexion au serveur");
        } else {
          toast.error("Aucune réponse du serveur");
        }
      } else {
        // Erreur dans la configuration de la requête
        toast.error("Erreur de configuration de la requête");
      }

      console.error("Error details:", error.config);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payrollData = {
        employeeId: Number(formData.employeeId),
        baseSalary: Number(formData.baseSalary),
        bonus: Number(formData.bonus),
        deductions: Number(formData.deductions),
        paymentDate: formData.paymentDate,
      };

      await payrollApi.post("/", payrollData);
      toast.success("Fiche de paie ajoutée avec succès");
      fetchPayrolls();
      // Reset form
      setFormData({
        employeeId: "",
        baseSalary: "",
        bonus: "",
        deductions: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la fiche de paie");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette fiche de paie ?")
    ) {
      try {
        await payrollApi.delete(`/${id}`);
        toast.success("Fiche de paie supprimée avec succès");
        fetchPayrolls();
      } catch (error) {
        toast.error("Erreur lors de la suppression de la fiche de paie");
      }
    }
  };

  return (
    <DefaultLayout>
      <ToastContainer position="top-right" autoClose={5000} />
      <Breadcrumb pageName="Gestion des Paies" />

      <div className="grid grid-cols-1 gap-9">
        {/* Formulaire d'ajout */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-1">
          <h3 className="mb-6 text-xl font-semibold text-black">
            Ajouter une fiche de paie
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Employé
                </label>
                <input
                  type="number"
                  name="employeeId"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Salaire de base
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bonus
                </label>
                <input
                  type="number"
                  name="bonus"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={formData.bonus}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Déductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date de paiement
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  className="w-full rounded border border-stroke px-3 py-2 focus:border-primary focus-visible:outline-none"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Liste des fiches de paie */}
        <div className="rounded-lg border border-stroke bg-white p-4 shadow-1">
          <div className="max-w-full overflow-x-auto">
            {loading ? (
              <div className="py-4 text-center">Chargement en cours...</div>
            ) : payrolls.length === 0 ? (
              <div className="py-4 text-center">
                Aucune fiche de paie disponible
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                      ID
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Employé
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Salaire Base
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Bonus
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Déductions
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Net
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((payroll, index) => (
                    <tr key={payroll.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {payroll.id}
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        Employé #{payroll.employeeId}
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {payroll.baseSalary.toFixed(2)} €
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {payroll.bonus.toFixed(2)} €
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {payroll.deductions.toFixed(2)} €
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <span className="font-bold">
                          {payroll.netSalary.toFixed(2)} €
                        </span>
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {new Date(payroll.paymentDate).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === payrolls.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center justify-end space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setFormData({
                                employeeId: payroll.employeeId.toString(),
                                baseSalary: payroll.baseSalary.toString(),
                                bonus: payroll.bonus.toString(),
                                deductions: payroll.deductions.toString(),
                                paymentDate: payroll.paymentDate,
                              });
                              handleDelete(payroll.id);
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
                            onClick={() => handleDelete(payroll.id)}
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
