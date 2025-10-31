"use client";

import { useState, useEffect } from "react";
import {
  Search,
  User,
  Building,
  Fingerprint,
  Loader2,
  X,
  Info,
} from "lucide-react";
import { Socio } from "../types/socios";
import { FichaSocio } from "@/components/FichaSocio";

// Datos de ejemplo para las empresas. Esto podría venir de una API.
const empresas = [
  { value: "werchow", label: "Werchow S.A.", port: "3001" },
  { value: "mutual", label: "Mutual San Valentin", port: "3001" },
  { value: "sanmiguel", label: "San Miguel Sepelios", port: "3004" },
  { value: "isj", label: "Mutual I.S.J.", port: "3005" },
];

export default function SociosPage() {
  const [numeroSocio, setNumeroSocio] = useState("");
  const [numeroDni, setNumeroDni] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Socio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // useEffect se ejecutará cada vez que cambie uno de los campos del formulario.
  // Aquí se centraliza la lógica de validación.
  useEffect(() => {
    // El formulario es válido si:
    // 1. Se ha seleccionado una empresa.
    // 2. Y (se ha ingresado un número de socio O se ha ingresado un DNI).
    const isValid =
      empresa !== "" && (numeroSocio.trim() !== "" || numeroDni.trim() !== "");
    setIsFormValid(isValid);
  }, [numeroSocio, numeroDni, empresa]);

  // useEffect para limpiar el error después de un tiempo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (error || success) {
      timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000); // El toast desaparecerá después de 5 segundos
    }
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleNewSearch = () => {
    setSearchResults(null);
    setNumeroSocio("");
    setNumeroDni("");
    setError(null);
    setSuccess(null);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setSearchResults(null); // Limpia resultados anteriores

    // 1. Encontrar el puerto de la empresa seleccionada
    const selectedEmpresa = empresas.find((e) => e.value === empresa);
    if (!selectedEmpresa) {
      setError("Empresa no válida seleccionada.");
      setLoading(false);
      return;
    }
    const port = selectedEmpresa.port;

    // 2. Determinar el valor de 'f' y el valor de búsqueda
    let f = "";
    let valor = "";

    if (numeroSocio.trim() !== "") {
      // Búsqueda por número de socio
      valor = numeroSocio.trim();
      f = empresa === "mutual" ? "mutual contrato" : "maestro contrato";
    } else if (numeroDni.trim() !== "") {
      // Búsqueda por DNI
      valor = numeroDni.trim();
      f = empresa === "mutual" ? "mutual" : "maestro";
    }

    // 3. Construir y ejecutar la llamada a la API
    try {
      const params = new URLSearchParams({ port, f, valor });
      const response = await fetch(`/api/socios?${params.toString()}`);

      if (!response.ok) {
        throw new Error(
          "Error al buscar el socio. Por favor, intente de nuevo."
        );
      }

      const dat = await response.json();
      const data = JSON.parse(dat);

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data[0]); // Guardamos solo el primer socio encontrado
        setSuccess(`Se encontraron ${data.length} resultado(s).`);
      } else {
        // Si no hay datos, mostramos un toast de advertencia/info
        setError("Socio no encontrado, verifica los datos ingresados");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!searchResults ? (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Búsqueda de Socios
          </h1>
          <p className="text-gray-600 mb-8">
            Seleccione una empresa e ingrese el N° de Socio o DNI para comenzar.
          </p>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Selector de Empresa */}
            <div>
              <label
                htmlFor="empresa"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Seleccionar Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="" disabled>
                    -- Seleccione una opción --
                  </option>
                  {empresas.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campo Número de Socio */}
            <div>
              <label
                htmlFor="numeroSocio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Socio
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="numeroSocio"
                  value={numeroSocio}
                  onChange={(e) => setNumeroSocio(e.target.value)}
                  placeholder="Ej: 12345"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Campo Número de DNI */}
            <div>
              <label
                htmlFor="numeroDni"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de DNI
              </label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="numeroDni"
                  value={numeroDni}
                  onChange={(e) => setNumeroDni(e.target.value)}
                  placeholder="Ej: 25123456"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Botón de Búsqueda */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Buscar Socio
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        // Resultados de la Búsqueda
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Ficha del Socio
            </h2>
            <button
              onClick={handleNewSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Nueva Búsqueda
            </button>
          </div>
          {/* Mostramos la ficha del primer socio encontrado */}
          <FichaSocio socio={searchResults as Socio} />
        </div>
      )}

      {/* Toast de Notificación */}
      {success && (
        <div className="fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center max-w-sm z-50">
          <Info className="h-6 w-6 mr-3" />
          <div className="grow">{success}</div>
          <button
            onClick={() => setSuccess(null)}
            className="ml-4 text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      {error && (
        <div className="fixed top-5 right-5 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-lg flex items-center max-w-sm z-50">
          <Info className="h-6 w-6 mr-3" />
          <div className="grow">{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-yellow-500 hover:text-yellow-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
