import { File, Link as LinkIcon, Trash2 } from "lucide-react";

interface Archivo {
  name: string;
  url: string;
}

interface ListaArchivosProps {
  archivos: Archivo[];
  loading: boolean;
  onDelete: (filename: string) => void;
}

export function ListaArchivos({
  archivos,
  loading,
  onDelete,
}: ListaArchivosProps) {
  if (loading) {
    return (
      <div className="text-center text-gray-500">Cargando archivos...</div>
    );
  }

  if (archivos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No hay archivos subidos para este socio.
      </div>
    );
  }

  return (
    <ul className="mt-4 border-t pt-4 space-y-2">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Archivos Cargados
      </h3>
      {archivos.map((archivo) => (
        <li
          key={archivo.name}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <File className="h-5 w-5 text-gray-600" />
            <span className="text-gray-800 truncate" title={archivo.name}>
              {archivo.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={archivo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-100 transition-colors"
              title="Ver archivo"
            >
              <LinkIcon className="h-5 w-5" />
            </a>
            <button
              onClick={() => onDelete(archivo.name)}
              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
              title="Eliminar archivo"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
