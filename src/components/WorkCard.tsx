import { IWork } from "@types";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import "@styles/WorkCard.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkCardProps = {
  work: IWork;
};

const WorkCard = ({ work }: WorkCardProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotoPaths.length) %
        work.workPhotoPaths.length
    );
  };

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?");

    if (hasConfirmed) {
      try {
        await fetch(`api/work/${work._id}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const { data: session, update } = useSession();
  const userId = session?.user?.id;

  /* ADD TO WISHLIST */
  const wishlist = session?.user?.wishlist;

  const isLiked = wishlist?.find((item) => item?._id === work._id);

  const patchWishlist = async () => {
    try {
      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
        method: "PATCH",
      });

      const data = await response.json();

      update({ user: { wishlist: data.wishlist } }); // update session
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="work-card"
      onClick={() => {
        router.push(`/work-details?id=${work._id}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {work.workPhotoPaths?.map((photo, index) => (
            <div className="slide" key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="work" />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="info">
        <div>
          <h3>{work.title}</h3>
          <div className="creator">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={work.creator?.profileImagePath} alt="creator" />
            <span>{work.creator?.username}</span> in{" "}
            <span>{work.category}</span>
          </div>
        </div>
        <div className="price">${work.price}</div>
      </div>
      {userId === work?.creator?._id && (
        <div
          className="icon delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Delete
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        </div>
      )}

      <div
        className="icon like"
        onClick={(e) => {
          e.stopPropagation();
          patchWishlist();
        }}
      >
        {isLiked ? (
          <Favorite
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              color: "red",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        ) : (
          <FavoriteBorder
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WorkCard;
