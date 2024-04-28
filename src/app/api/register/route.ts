import { connectToDatabase } from "@lib/database";
import User from "@lib/database/models/user.model";
import { hash } from "bcryptjs";
import { mkdir, stat, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
import mime from "mime";

/* USER REGISTER */
export const POST = async (req: Request) => {
  try {
    /* Connect to MongoDB */
    await connectToDatabase();

    const data = await req.formData();

    /* Take information from the Form in the Front-End */
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password") as string;
    const file = data.get("profileImage") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

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
    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    const fileUrl = `${relativeUploadDir}/${filename}`;

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 409 }
      );
    }

    /* Hash the password */
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    /* Create a new User */
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImagePath: fileUrl,
    });

    /* Save new User */
    await newUser.save();

    /* Send a success message */
    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Fail to create new User!" },
      { status: 500 }
    );
  }
};
