import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CollectionAddCard = () => {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token && JSON.parse(atob(token.split('.')[1])).is_admin;
  };

  const createNewCollection = async () => {
    if (!isLoggedIn()) {
      alert('Anda belum login sebagai admin');
      navigate('/login');
      return;
    }

    const collectionName = prompt("Please enter collection name");
    if (!collectionName) return;

    const collectionAlias = prompt(
      "Please enter collection alias (2 characters only) Ex: 'PC'"
    );
    if (!collectionAlias) return;

    if (collectionAlias.length !== 2) {
      alert("Alias must only contain 2 characters. Ex: 'PC'");
      return;
    }

    try {
      await fetch("/api/collections", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: collectionName,
          alias: collectionAlias.toUpperCase(),
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection.");
    }
  };

  return (
    <Link
      onClick={() => createNewCollection()}
      className="flex flex-col bg-slate-200 rounded-xl shadow-xl w-48 h-24 mx-3 my-3 px-3 py-3"
    >
      <h1 className="text-gray-400 font-extrabold">Add Collection</h1>
      <h1 className="text-gray-700 font-black text-4xl mx-auto">+</h1>
    </Link>
  );
};

export default CollectionAddCard;
