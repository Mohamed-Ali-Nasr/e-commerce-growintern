import "@styles/WorkList.scss";
import { IWork } from "@types";
import WorkCard from "./WorkCard";

type WorkListProps = {
  data: IWork[] | undefined;
};

const WorkList = ({ data }: WorkListProps) => {
  return (
    <div className="work-list">
      {data?.map((work) => (
        <WorkCard key={work?._id} work={work} />
      ))}
    </div>
  );
};

export default WorkList;
