import { connectToDatabase } from "@lib/database";
import User from "@lib/database/models/user.model";
import Work from "@lib/database/models/work.model";
import { IWork } from "@types";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string; workId: string } }
) => {
  try {
    await connectToDatabase();
    const userId = params.id;
    const workId = params.workId;

    const user = await User.findById(userId);
    const work = await Work.findById(workId).populate("creator");

    const favoriteWork = user.wishlist.find(
      (item: IWork) => item._id?.toString() === workId
    );

    if (favoriteWork) {
      user.wishlist = user.wishlist.filter(
        (item: IWork) => item._id?.toString() !== workId
      );

      await user.save();
      return new Response(
        JSON.stringify({
          message: "Work removed from wishlist",
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    } else {
      user.wishlist.push({
        _id: work._id,
        category: work.category,
        creator: work.creator,
        description: work.description,
        price: work.price,
        title: work.title,
        workPhotoPaths: work.workPhotoPaths,
      });
      await user.save();

      return new Response(
        JSON.stringify({
          message: "Work added to wishlist",
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    }
  } catch (err) {
    console.log(err);
    return new Response("Failed to patch work to wishlist", { status: 500 });
  }
};
