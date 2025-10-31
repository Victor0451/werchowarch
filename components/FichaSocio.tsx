"use client";

import { useState, useEffect } from "react";
import { Socio } from "../app/types/socios";
import {
  User,
  Home,
  FileText,
  Upload,
  Paperclip,
  Loader2,
  X,
  Info,
  FileCheck2,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { ListaArchivos } from "./ListaArchivos";

interface FichaSocioProps {
  socio: Socio;
}

const InputSoloLectura = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md shadow-sm">
      {value || "No informado"}
    </div>
  </div>
);

export function FichaSocio({ socio }: FichaSocioProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deleteResponse, setDeleteResponse] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [archivosSubidos, setArchivosSubidos] = useState<
    { name: string; url: string }[]
  >([]);
  const [loadingArchivos, setLoadingArchivos] = useState(true);

  const fetchArchivos = async () => {
    setLoadingArchivos(true);
    try {
      const response = await fetch(`/api/socios/${socio.CONTRATO}/files`);
      if (response.ok) {
        const files = await response.json();
        setArchivosSubidos(files);
      }
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    } finally {
      setLoadingArchivos(false);
    }
  };

  // Cargar la lista de archivos cuando el componente se monta
  useEffect(() => {
    if (socio.CONTRATO) {
      fetchArchivos();
    }
  }, [socio.CONTRATO]);

  // Efecto para limpiar el toast después de 5 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = async (filename: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el archivo "${filename}"?`
      )
    ) {
      return;
    }

    setDeleteResponse(null);
    try {
      const response = await fetch(
        // eslint-disable-line
        `/api/socios/${socio.CONTRATO}/files/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al eliminar el archivo.");
      }

      setToast({ message: result.message, type: "success" });
      // Refrescar la lista de archivos después de una eliminación exitosa
      fetchArchivos();
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
      setToast(null);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setToast(null);

    const compressionOptions = {
      maxSizeMB: 1, // Tamaño máximo en MB
      maxWidthOrHeight: 1920, // Redimensionar si es más grande
      useWebWorker: true,
      fileType: "image/webp", // Comprimir a formato WebP
    };

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        let fileToUpload = file;
        // Comprimir solo si es una imagen
        if (file.type.startsWith("image/")) {
          console.log(`Comprimiendo ${file.name}...`);
          fileToUpload = await imageCompression(file, compressionOptions);
        }

        const formData = new FormData();
        formData.append("file", fileToUpload, file.name); // Usar el nombre original

        const response = await fetch(`/api/socios/${socio.CONTRATO}/uploads`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(
            `Error al subir ${file.name}: ${errorResult.message}`
          );
        }
        return response.json();
      });

      await Promise.all(uploadPromises);

      setToast({
        message: `${selectedFiles.length} archivo(s) subido(s) con éxito.`,
        type: "success",
      });
      setSelectedFiles([]); // Limpiar selección después de subir
      // Refrescar la lista de archivos después de una subida exitosa
      fetchArchivos();
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ... (código de Datos Personales y Domicilio sin cambios) ... */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="h-6 w-6 text-indigo-600" /> Datos Personales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputSoloLectura label="Contrato" value={socio.CONTRATO} />
          <InputSoloLectura label="Apellido" value={socio.APELLIDOS} />
          <InputSoloLectura label="Nombres" value={socio.NOMBRES} />
          <InputSoloLectura label="DNI" value={socio.NRO_DOC} />
        </div>
      </div>

      {/* Domicilio */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Home className="h-6 w-6 text-indigo-600" /> Domicilio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputSoloLectura label="Calle" value={socio.CALLE} />
          <InputSoloLectura label="N°" value={socio.NRO_CALLE} />
          <InputSoloLectura label="Barrio" value={socio.BARRIO} />
          <InputSoloLectura label="Localidad" value={socio.LOCALIDAD} />
        </div>
      </div>

      {/* Gestión de Documentos */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Paperclip className="h-6 w-6 text-indigo-600" /> Gestión de
          Documentos
        </h3>

        {/* Lista de archivos existentes con funcionalidad de borrado */}
        <ListaArchivos
          archivos={archivosSubidos}
          loading={loadingArchivos}
          onDelete={handleDelete}
        />

        {/* Separador y nueva área de subida */}
        <div className="mt-6 border-t pt-6">
          <form onSubmit={handleUpload}>
            <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <Upload
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Selecciona archivos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                    />
                  </label>
                  <p className="pl-1">o arrástralos aquí</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, PDF, etc. hasta 1MB.
                </p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Archivos seleccionados:
                </h4>
                <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-2 pl-3 pr-4 text-sm"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <FileCheck2
                          className="h-5 w-5 shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                        <span className="ml-2 w-0 flex-1 truncate">
                          {file.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      `Subir ${selectedFiles.length} archivo(s)`
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      {toast && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-md shadow-lg flex items-center max-w-sm z-50 ${
            toast.type === "success"
              ? "bg-green-100 border-l-4 border-green-500 text-green-700"
              : "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
          }`}
        >
          <Info className="h-6 w-6 mr-3" />
          <div className="grow">{toast.message}</div>
          <button onClick={() => setToast(null)} className="ml-4">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
