import { connectToDatabase } from "@lib/database";
import Work from "@lib/database/models/work.model";

export const GET = async (
  req: Request,
  { params }: { params: { query: string } }
) => {
  try {
    await connectToDatabase();

    const { query } = params;
    let works = [];

    if (query === "all") {
      works = await Work.find().populate("creator");
    } else {
      works = await Work.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
        ],
      }).populate("creator");
    }

    if (!works) return new Response("No works found", { status: 404 });

    return new Response(JSON.stringify(works), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Internal server error", { status: 500 });
  }
};
