import React from "react";
import { Skeleton } from "antd-mobile";

export default function SkeletonAgian() {
  return (
    <div className="skeleton-again-box">
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated />
    </div>
  );
}
