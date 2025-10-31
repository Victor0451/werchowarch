import Link from "next/link";
import {
  Archive,
  Target,
  CheckCircle,
  Search,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Archive className="h-10 w-10 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Sistema de Gestión de Archivos
        </h1>
      </div>
      <p className="text-gray-600 mb-8 text-lg">
        Bienvenido. Esta plataforma ha sido diseñada para simplificar y
        centralizar la administración de la documentación asociada a cada socio,
        proporcionando un acceso rápido, seguro y eficiente a sus legajos
        digitales.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Objetivos */}
        <div className="border-l-4 border-indigo-500 pl-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Objetivos Principales
          </h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>Centralizar la documentación de los socios.</li>
            <li>Optimizar el acceso a la información.</li>
            <li>Mejorar la eficiencia y reducir el uso de papel.</li>
            <li>Aumentar la seguridad de los datos.</li>
          </ul>
        </div>

        {/* Funcionalidades */}
        <div className="border-l-4 border-green-500 pl-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Funcionalidades Clave
          </h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>Búsqueda de socios por contrato o DNI.</li>
            <li>Visualización de la ficha completa del socio.</li>
            <li>Carga de archivos (imágenes, PDF, etc.).</li>
            <li>Gestión y eliminación de documentos existentes.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-700 mb-4 text-lg">
          Para comenzar, diríjase a la sección de socios.
        </p>
        <Link
          href="/socios"
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform transform hover:scale-105"
        >
          <Search className="h-5 w-5" />
          Ir a Socios
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
