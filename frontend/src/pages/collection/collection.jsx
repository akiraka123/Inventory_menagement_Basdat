import React, { useState, useEffect } from "react";
import CollectionCard from "../../component/collection_card";
import CollectionAddCard from "../../component/collection_add_card";

const Collection = () => {
  const [collections, setCollections] = useState();

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch("/api/collections");
      const json = await response.json();
      if (response.ok) {
        setCollections(json);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="w-full p-3 bg-slate-600 text-white">
      <h1 className="text-lg font-semibold">All Collection</h1>
      <div className="flex flex-wrap">
        {collections &&
          collections.map((col) => {
            return <CollectionCard collection={col} key={col.id} />;
          })}
        <CollectionAddCard />
      </div>
    </div>
  );
};

export default Collection;
