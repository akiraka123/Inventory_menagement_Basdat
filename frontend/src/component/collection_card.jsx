import React from "react";
import { Link } from "react-router-dom";

const CollectionCard = (props) => {
  const { collection } = props;
  return (
    <Link
      to={`${collection.id}`}
      className="flex flex-col bg-slate-200 rounded-xl shadow-xl w-48 h-24 mx-3 my-3 px-3 py-3"
    >
      <h1 className="text-gray-400 font-extrabold">{collection.name}</h1>
      <h1 className=" text-gray-700 font-black text-4xl">
        {collection.totalitem}
      </h1>
      <div className="h-1 bg-red-800 mt-auto" />
    </Link>
  );
};

export default CollectionCard;
