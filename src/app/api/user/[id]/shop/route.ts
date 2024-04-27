import { connectToDatabase } from "@lib/database";
import User from "@lib/database/models/user.model";
import Work from "@lib/database/models/work.model";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id);
    const workList = await Work.find({ creator: params.id }).populate(
      "creator"
    );

    user.works = workList;
    await user.save();

    return new Response(JSON.stringify({ user: user, workList: workList }), {
      status: 200,
    });
  } catch (err) {
    return new Response("Failed to fetch work list by user", { status: 500 });
  }
};
