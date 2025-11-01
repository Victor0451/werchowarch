import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { sgi, arch } from "@/lib/db";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
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
  const dni = data.get("dni") as string;
  const socio = data.get("socio") as string;
  const empresa = data.get("empresa") as string;

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

  // --- Registrar en la base de datos ---
  try {
    // 1. Obtener el operador logueado desde la cookie
    const tokenCookie = (await cookies()).get("werchow-token");
    if (!tokenCookie) {
      throw new Error("Token de autenticación no encontrado.");
    }

    const { payload } = await jwtVerify(tokenCookie.value, SECRET_KEY);
    if (!payload.id) {
      throw new Error("Token inválido: ID de operador no encontrado.");
    }

    const operadorResult = await sgi.query(
      `SELECT usuario FROM operador WHERE id = ?`,
      [payload.id]
    );
    const operador =
      Array.isArray(operadorResult) && operadorResult.length > 0
        ? operadorResult[0].usuario
        : "desconocido";

    // 2. Insertar el registro del archivo
    const registro = await arch.query(`
      INSERT INTO archivos_socios (empresa, contrato, dni, socio, archivo, url, operador)
      VALUES (
      '${empresa}',
      ${contrato},
      '${dni}',
      '${socio}',
      '${file.name}',
      '${publicPath}',
      '${operador}'
      
      )
    `);

     return NextResponse.json({ message: "Archivo registrado en la base de datos." });

  } catch (dbError: any) {
    // Si la subida del archivo fue exitosa pero el registro en BD falla,
    // lo registramos en la consola pero no fallamos la petición completa.
    console.error(
      "Error al registrar el archivo en la base de datos:",
      dbError.message
    );
  }

  return NextResponse.json({
    message: "Archivo subido con éxito.",
    filePath: publicPath,
  });
}
