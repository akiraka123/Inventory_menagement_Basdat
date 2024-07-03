import React from "react";
import { useState } from "react";

const AddItemModal = (props) => {
  const { isActive, onCancel, collectionid } = props;
  const [loadedImage, setLoadedImage] = useState(null);

  if (!onCancel) {
    throw new Error("onCancel prop is required");
  }

  if (!collectionid) {
    throw new Error("collectionid prop is required");
  }

  const [inputData, setInputData] = useState({
    name: null,
    collectionid: props.collectionid,
    condition: "Good",
    ownership: null,
    description: null,
    image: null,
  });

  function handleImage(e) {
    const newData = { ...inputData };
    newData[e.target.id] = e.target.files[0];
    setInputData(newData);

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setLoadedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleForm(e) {
    const newData = { ...inputData };
    newData[e.target.id] = e.target.value;
    setInputData(newData);
  }

  async function handleSubmit() {
    if (
      !inputData.name ||
      !inputData.collectionid ||
      !inputData.condition ||
      !inputData.ownership ||
      !inputData.description ||
      !inputData.image
    ) {
      alert("Please fill all form");
      return;
    }

    const formData = new FormData();
    formData.append("name", inputData.name);
    formData.append("collectionid", inputData.collectionid);
    formData.append("condition", inputData.condition);
    formData.append("ownership", inputData.ownership);
    formData.append("description", inputData.description);
    formData.append("image", inputData.image);

    const res = await fetch("/api/items", {
      method: "POST",
      body: formData,
    });

    window.location.reload();
  }

  return (
    <div
      className={`${
        isActive ? "" : "hidden"
      } fixed z-50 inset-0 overflow-y-auto`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              data-behavior="cancel"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onCancel}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className=" mt-3 text-left grow">
              <h3
                className="text-lg leading-6 text-gray-900 font-bold"
                id="modal-headline"
              >
                Add Item
              </h3>

              {/* Form here */}

              <form
                onSubmit={() => {
                  console.log("Hahaha");
                }}
              >
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12 w-full">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            id="name"
                            name="name"
                            type="name"
                            autoComplete="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                            onChange={(e) => handleForm(e)}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="condition"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Condition
                        </label>
                        <div className="mt-2">
                          <select
                            id="condition"
                            name="condition"
                            autoComplete="condition"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            onChange={(e) => handleForm(e)}
                          >
                            <option>Good</option>
                            <option>Poor</option>
                            <option>Damaged</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="ownership"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Ownership
                        </label>
                        <div className="mt-2">
                          <input
                            id="ownership"
                            name="ownership"
                            type="ownership"
                            autoComplete="ownership"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                            onChange={(e) => handleForm(e)}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Item photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          {!loadedImage ? (
                            <div className="text-center">
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="image"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2 hover:text-sky-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => handleImage(e)}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <div className="w-96 h-96 overflow-hidden">
                                <img
                                  src={loadedImage}
                                  alt="Loaded Image"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <label
                                htmlFor="image"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2 hover:text-sky-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="image"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={(e) => handleImage(e)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Item Description
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                            onChange={(e) => handleForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    onClick={handleSubmit}
    
                  >
                  Save
                  </button>
                </div>
              </form>

              {/* End Form here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
