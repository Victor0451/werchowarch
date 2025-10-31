import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { mkdir, stat } from "fs/promises";

export async function POST(
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

  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { message: "No se subió ningún archivo." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Crear un directorio para el socio si no existe
  const uploadDir = path.join(process.cwd(), "public/uploads", contrato);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Error al crear el directorio:", error);
    return NextResponse.json(
      { message: "Error al crear directorio en el servidor." },
      { status: 500 }
    );
  }

  // Guardar el archivo
  const filePath = path.join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  console.log(`Archivo guardado en: ${filePath}`);

  const publicPath = `/uploads/${contrato}/${file.name}`;

  return NextResponse.json({
    message: "Archivo subido con éxito.",
    filePath: publicPath,
  });
}
