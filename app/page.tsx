import Link from "next/link";
import {
  Archive,
  Search,
  Upload,
  FileText,
  LogIn,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center items-center mb-4">
          <Archive className="h-16 w-16 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Gestión Digital de Archivos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Una solución moderna y segura para centralizar y administrar la
          documentación de socios de forma eficiente.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl w-full">
        {/* Feature Card 1 */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <Search className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Búsqueda Rápida
          </h3>
          <p className="text-gray-600">
            Encuentra socios al instante por contrato o DNI.
          </p>
        </div>
        {/* Feature Card 2 */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <Upload className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Digitalización Centralizada
          </h3>
          <p className="text-gray-600">
            Sube y organiza documentos como imágenes y PDFs en un solo lugar.
          </p>
        </div>
        {/* Feature Card 3 */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <FileText className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Gestión Completa
          </h3>
          <p className="text-gray-600">
            Visualiza, administra y elimina archivos de forma segura.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform transform hover:scale-105"
        >
          <LogIn className="h-5 w-5" />
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
