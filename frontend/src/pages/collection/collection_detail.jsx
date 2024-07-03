import React, { useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import ConfirmDialog from "../../component/confirm_dialog";
import AddItemModal from "../../component/add_item_modal";
import EditItemModal from "../../component/EditItemModal";

const CollectionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);
  const [recordsSize, setRecordsSize] = useState(5);
  const [isModalActive, setIsModalActive] = useState(false);
  const [itemidToDelete, setItemidToDelete] = useState(null);
  const [isDelColModalActive, setIsDelColModalActive] = useState(false);
  const [isAddItemModalActive, setIsAddItemModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const lastIndex = pages * recordsSize;
  const firstIndex = lastIndex - recordsSize;
  const records = items.slice(firstIndex, lastIndex);
  const npage = Math.ceil(items.length / recordsSize);
  const numbers = Array.from({ length: npage }, (_, i) => i + 1);

  const isAdmin = () => {
    const token = localStorage.getItem("token");
    return token && JSON.parse(atob(token.split(".")[1])).is_admin;
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const stripPath = (filePath) => {
    const prefixToRemove = "..\\frontend\\public\\";
    return filePath.startsWith(prefixToRemove)
      ? "\\" + filePath.substring(prefixToRemove.length)
      : filePath;
  };

  const formatDate = (created_at) => {
    const date = new Date(created_at);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleDeleteItem = async () => {
    await fetch(`/api/items/${itemidToDelete}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    window.location.reload();
  };

  const handleDeleteCollection = async () => {
    await fetch(`/api/collections/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    navigate("/collection");
    window.location.reload();
  };

  const handleSave = async (updatedItem) => {
    const formData = new FormData();
    for (const key in updatedItem) {
      formData.append(key, updatedItem[key]);
    }
  
    // Check if an image file exists and add it to formData
    if (updatedItem.imageFile) {
      formData.append("image", updatedItem.imageFile);
    }
  
    const res = await fetch(`/api/items/${updatedItem.id}`, {
      method: "PATCH",
      body: formData,
    });
  
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to update item");
    }
  };
  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch(`/api/collections/${id}`);
      const json = await response.json();
      if (response.ok) {
        setName(json.collection.name);
        setItems(json.items);
      }
    };
    fetchCollections();
  }, [id]);

  return (
    <div className="w-full p-3 bg-slate-600 text-white">
      {isAddItemModalActive && (
      <AddItemModal
        isActive={isAddItemModalActive}
        onCancel={() => setIsAddItemModalActive(false)}
        collectionid={id}
      />
      )}
      {isEditModalActive && (
        <EditItemModal
          isActive={isEditModalActive}
          onCancel={() => setIsEditModalActive(false)}
          item={itemToEdit}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        isActive={isModalActive}
        onCancel={() => setIsModalActive(false)}
        onConfirm={handleDeleteItem}
        modalTitle="Are you sure want to delete this item?"
      />

      <ConfirmDialog
        isActive={isDelColModalActive}
        onCancel={() => setIsDelColModalActive(false)}
        onConfirm={handleDeleteCollection}
        modalTitle="Are you sure want to delete this collection?"
      />

      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold">{name}</h1>
        {isAdmin() && (
          <button
            onClick={() => setIsDelColModalActive(true)}
            className="ml-auto mr-10 h-10 px-3 rounded-xl border border-gray-400 bg-red-500 flex items-center"
          >
            <MdDelete className="mr-1" />
            Delete collection
          </button>
        )}
      </div>
      <div className="flex mb-2">
        <div className="flex gap-3">
          <h1 className="my-auto">Show</h1>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {recordsSize}
                <FaChevronDown
                  className="-mr-1 h-3 w-3 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {[5, 10, 15, 20].map((size) => (
                    <Menu.Item key={size}>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setRecordsSize(size);
                            setPages(1);
                          }}
                          className={classNames(
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                            "block px-4 py-2 text-xs"
                          )}
                        >
                          {size}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <h1 className="my-auto">entries</h1>
        </div>
        {isAdmin() && (
          <button
            onClick={() => setIsAddItemModalActive(true)}
            className="ml-auto mr-10 h-8 px-3 rounded-xl border border-gray-400 bg-sky-600 flex items-center"
          >
            <FaPlus className="mr-1" />
            Add item
          </button>
        )}
      </div>
      <table className="w-[98%]">
        <thead>
          <tr className="text-gray-800">
            <th className="shadow-md py-2 px-4 bg-gray-100 rounded-l-lg">Name</th>
            <th className="shadow-md py-2 px-4 bg-gray-100">Item ID</th>
            <th className="shadow-md py-2 px-4 bg-gray-100">Picture</th>
            <th className="shadow-md py-2 px-4 bg-gray-100">Condition</th>
            <th className="shadow-md py-2 px-4 bg-gray-100">Ownership</th>
            <th className="shadow-md py-2 px-4 bg-gray-100">Entry Date</th>
            <th className="shadow-md py-2 px-4 bg-gray-100">Description</th>
            <th className="shadow-md py-2 px-4 bg-gray-100 rounded-r-lg">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-900 font-semibold">
          {records.map((item, index) => {
            const bgCol = index % 2 === 0 ? "bg-gray-300" : "bg-gray-100";
            return (
              <tr key={item.id}>
                <td className={`border-t border-l border-b border-gray-600 w-10 text-center ${bgCol} rounded-l-lg`}>
                  {item.name ?? "-"}
                </td>
                <td className={`border-y border-gray-600 w-10 text-center ${bgCol}`}>{item.itemid}</td>
                <td className={`border-y border-gray-600 w-10 text-center ${bgCol}`}>
                  <img
                    className="items-center w-48 h-48 object-cover"
                    src={`${stripPath(item.imagepath)}`}
                    alt="Item image"
                  />
                </td>
                <td className={`border-y border-gray-600 w-10 text-center ${bgCol}`}>{item.condition}</td>
                <td className={`border-y border-gray-600 w-10 text-center ${bgCol}`}>{item.ownership}</td>
                <td className={`border-y border-gray-600 w-10 text-center ${bgCol}`}>{formatDate(item.created_at)}</td>
                <td className={`border-y border-gray-600 w-10 text-center ${bgCol}`}>{item.description ?? "-"}</td>
                <td className={`border-t border-r border-b border-gray-600 w-10 text-center ${bgCol} rounded-r-lg`}>
                  <div className="flex flex-row justify-center">
                    {isAdmin() ? (
                      <>
                        <button
                          onClick={() => {
                            setItemToEdit(item);
                            setIsEditModalActive(true);
                          }}
                          className="bg-[#D5E5EB] rounded-lg flex items-center justify-center h-7 w-7 mr-2"
                        >
                          <MdEdit color="#297596" />
                        </button>
                        <button
                          onClick={() => {
                            setIsModalActive(!isModalActive);
                            setItemidToDelete(item.id);
                          }}
                          className="bg-[#EBD5D5] rounded-lg flex items-center justify-center h-7 w-7"
                        >
                          <MdDelete color="#962929" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => alert("Only admins can make changes")}
                        className="bg-gray-400 rounded-lg flex items-center justify-center h-7 w-7"
                      >
                        <MdDelete color="#FFFFFF" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex w-[98%] items-center justify-between rounded-lg py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-200">
              Showing{" "}
              <span className="font-medium">
                {firstIndex > 0 ? firstIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(lastIndex, items.length)}
              </span>{" "}
              of <span className="font-medium">{items.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex items-center rounded-l-md px-2 py-2 bg-gray-600 text-gray-200 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => {
                  pages > 1 && setPages(pages - 1);
                }}
              >
                <span className="sr-only">Previous</span>
                <FaAngleLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {numbers.map((number) => (
                <button
                  key={number}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    number === pages
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-700 text-gray-200"
                  } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                  onClick={() => setPages(number)}
                >
                  {number}
                </button>
              ))}
              <button
                className="relative inline-flex items-center rounded-r-md px-2 py-2 bg-gray-600 text-gray-200 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => {
                  pages < npage && setPages(pages + 1);
                }}
              >
                <span className="sr-only">Next</span>
                <FaAngleRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
