import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readdir, stat } from "fs/promises";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ contrato: string }> }
) {
  const { contrato } = await context.params;

  if (!contrato) {
    return NextResponse.json(
      { message: "Número de contrato no especificado." },
      { status: 400 }
    );
  }

  const dirPath = path.join(process.cwd(), "public/uploads", contrato);

  try {
    // Verificar si el directorio existe
    await stat(dirPath);

    const files = await readdir(dirPath);
    const fileDetails = files.map((file) => ({
      name: file,
      url: `/uploads/${contrato}/${file}`,
    }));

    return NextResponse.json(fileDetails);
  } catch (error: any) {
    // Si el directorio no existe, es normal, simplemente no hay archivos.
    if (error.code === "ENOENT") {
      return NextResponse.json([]);
    }
    // Para otros errores, sí informamos.
    console.error("Error al leer el directorio:", error);
    return NextResponse.json(
      { message: "Error al obtener la lista de archivos." },
      { status: 500 }
    );
  }
}