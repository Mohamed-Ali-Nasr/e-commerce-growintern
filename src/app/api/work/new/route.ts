import { connectToDatabase } from "@lib/database";
import Work from "@lib/database/models/work.model";
import { mkdir, stat, writeFile } from "fs/promises";
import { join } from "path";
import mime from "mime";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    /* Connect to MongoDB */
    await connectToDatabase();

    const data = await req.formData();

    /* Extract info from the data */
    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    /* Get an array of uploaded photos */
    const photos = data.getAll("workPhotoPaths") as File[];

    const workPhotoPaths = [];

    /* Process and store each photo  */
    for (const photo of photos) {
      // Read the photo as an ArrayBuffer
      const bytes = await photo.arrayBuffer();

      // Convert it to a Buffer
      const buffer = Buffer.from(bytes);

      // Define the destination path for the uploaded file
      const relativeUploadDir = `/uploads/${new Date(Date.now())
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-")}`;

      const uploadDir = join(process.cwd(), "public", relativeUploadDir);

      try {
        await stat(uploadDir);
      } catch (e: any) {
        if (e.code === "ENOENT") {
          // This is for checking the directory is exist (ENOENT : Error No Entry)
          await mkdir(uploadDir, { recursive: true });
        } else {
          console.error(
            "Error while trying to create directory when uploading a file\n",
            e
          );
          return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
          );
        }
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${photo.name.replace(
        /\.[^/.]+$/,
        ""
      )}-${uniqueSuffix}.${mime.getExtension(photo.type)}`;
      await writeFile(`${uploadDir}/${filename}`, buffer);
      const fileUrl = `${relativeUploadDir}/${filename}`;
      // Store the file path in an array
      workPhotoPaths.push(fileUrl);
    }

    /* Create a new Work */
    const newWork = new Work({
      creator,
      category,
      title,
      description,
      price,
      workPhotoPaths,
    });

    await newWork.save();

    revalidatePath("/");

    return new Response(JSON.stringify(newWork), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new Work", { status: 500 });
  }
}
