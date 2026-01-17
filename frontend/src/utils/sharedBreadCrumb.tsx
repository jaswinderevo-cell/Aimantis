import React from "react";
import { useBreadCrumbs } from "./helper";

type SharedBreadCrumbProps = {
  padding?: string;
};

const SharedBreadCrumb = ({ padding }:SharedBreadCrumbProps) => {
  const breadCrumbs = useBreadCrumbs();
  return (
    <div className={`lg:hidden breadCrumb ${padding ? padding : " px-4 pt-4"}`}>
      <span className="text-black text-lg lg:text-xl font-semibold">
        {breadCrumbs}
      </span>
    </div>
  );
};

export default SharedBreadCrumb;
