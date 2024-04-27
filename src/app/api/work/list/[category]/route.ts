import { connectToDatabase } from "@lib/database";
import Work from "@lib/database/models/work.model";

export const GET = async (
  req: Request,
  { params }: { params: { category: string } }
) => {
  try {
    await connectToDatabase();

    const { category } = params;

    let workList;

    if (category !== "All") {
      workList = await Work.find({ category }).populate("creator");
    } else {
      workList = await Work.find().populate("creator");
    }

    return new Response(JSON.stringify(workList), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch Work List", { status: 500 });
  }
};
