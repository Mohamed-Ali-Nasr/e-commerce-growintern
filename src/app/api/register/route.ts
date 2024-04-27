import { connectToDatabase } from "@lib/database";
import User from "@lib/database/models/user.model";
import { hash } from "bcryptjs";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

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

    const profileImagePath = `D:/MernStack-Projects/ClonesOfBiggerWebsites/e-commerce-growintern/public/uploads/${file.name}`;
    await writeFile(profileImagePath, buffer);

    console.log(`open ${profileImagePath} to see the uploaded files`);

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
      profileImagePath: `/uploads/${file.name}`,
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
