import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { unlink, stat } from "fs/promises";
import { sgi, arch } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ contrato: string; filename: string }> }
) {
  const { contrato, filename } = await context.params;
  const decodedFilename = decodeURIComponent(filename);

  if (!contrato || !decodedFilename) {
    return NextResponse.json(
      { message: "Contrato o nombre de archivo no especificado." },
      { status: 400 }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "public/uploads",
    contrato,
    decodedFilename
  );

  try {
    // Verificar si el archivo existe antes de intentar eliminarlo
    await stat(filePath);
    await unlink(filePath);

    // Eliminar el registro de la base de datos
    await arch.query(
      `DELETE FROM archivos_socios WHERE contrato = ? AND archivo = ?`,
      [contrato, decodedFilename]
    );

    return NextResponse.json({ message: "Archivo eliminado con éxito." });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json(
        { message: "El archivo no existe." },
        { status: 404 }
      );
    }
    console.error("Error al eliminar el archivo:", error);
    return NextResponse.json(
      { message: "Error al eliminar el archivo." },
      { status: 500 }
    );
  }
}
