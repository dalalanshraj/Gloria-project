import { useEffect, useState } from "react";

import api from "../../api/axios";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);

  const [sectionType, setSectionType] = useState("");

  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

  // =====================================
  // FETCH DATA
  // =====================================

  const fetchData = async () => {
    try {
      const res = await api.get("/gallery");

      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================
  // UPLOAD
  // =====================================

  const upload = async (file) => {
    try {
      const formData = new FormData();

      formData.append("images", file);

      // OPTIONAL
      if (sectionType) {
        formData.append("sectionType", sectionType);
      }

      await api.post("/gallery", formData);

      fetchData();

      // RESET
      setSectionType("");
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // TOGGLE
  // =====================================

  const toggle = async (id) => {
    await api.put(`/gallery/${id}/toggle`);

    fetchData();
  };

  // =====================================
  // DELETE
  // =====================================

  const remove = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    await api.delete(`/gallery/${id}`);

    fetchData();
  };

  // =====================================
  // DRAG END
  // =====================================

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(images);

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    const updated = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setImages(updated);

    try {
      await api.put("/gallery/reorder", {
        images: updated.map((img) => ({
          _id: img._id,
          order: img.order,
        })),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div
        className="
        flex
        flex-col
        md:flex-row
        gap-4
        justify-between
        items-start
        md:items-center
        mb-8
      "
      >
        <div>
          <h1 className="text-3xl font-bold">Gallery Manager</h1>

          <p className="text-gray-500 mt-1">Upload, manage & reorder images</p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap gap-3">
          {/* SELECT */}
          <select
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-xl outline-none"
          >
            <option value="">Select Section (Optional)</option>
            <option value="hero">The Condo</option>
<option value="gulf-views">Prime Location</option>
<option value="living-room">Living Room</option>
<option value="master-bedroom">Master Bedroom</option>
<option value="second-bedroom">Second Bedroom</option>
<option value="third-bedroom">Third Bedroom</option>
<option value="kitchen">Fully Equipped Kitchen</option>
<option value="balcony">Private Balcony</option>
<option value="pool-hot-tub">Pool & Hot Tub</option>
<option value="community-amenities">Community Amenities</option>
<option value="beach-access">Beach Access</option>
<option value="family-friendly">Family Friendly</option>
<option value="local-attractions">Local Attractions</option>
          </select>

          {/* UPLOAD */}
          <label
            className="
            bg-black
            text-white
            px-5
            py-2
            rounded-xl
            cursor-pointer
            hover:bg-gray-800
            transition
          "
          >
            Upload Image
            <input
              type="file"
              hidden
              onChange={(e) => upload(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {/* DRAG DROP */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="
        flex
        flex-wrap
        gap-6
      "
            >
              {images.map((img, index) => (
                <Draggable key={img._id} draggableId={img._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                w-full
                sm:w-[48%]
                lg:w-[23%]
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                ${snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""}
              `}
                    >
                      {/* IMAGE */}
                      <div className="relative group">
                        <img
                          src={getImageUrl(img.image)}
                          className="
                    w-full
                    h-56
                    object-cover
                  "
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />

                        {/* OVERLAY */}
                        <div
                          className="
                    absolute
                    inset-0
                    bg-black/20
                    opacity-0
                    group-hover:opacity-100
                    transition
                  "
                        />

                        {/* DRAG */}
                        <div
                          className="
                    absolute
                    top-3
                    right-3
                    bg-white/90
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                  "
                        >
                          Drag
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4">
                        <p
                          className="
                    text-sm
                    font-semibold
                    capitalize
                    mb-3
                  "
                        >
                          {img.sectionType || "general"}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-between">
                          {/* TOGGLE */}
                          <div
                            onClick={() => toggle(img._id)}
                            className={`
                      w-12
                      h-6
                      flex
                      items-center
                      rounded-full
                      p-1
                      cursor-pointer
                      transition
                      ${
                        img.status === "published"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    `}
                          >
                            <div
                              className={`
                        bg-white
                        w-4
                        h-4
                        rounded-full
                        shadow-md
                        transform
                        transition
                        ${img.status === "published" ? "translate-x-6" : ""}
                      `}
                            />
                          </div>

                          {/* STATUS */}
                          <span className="text-xs text-gray-500">
                            {img.status}
                          </span>

                          {/* DELETE */}
                          <button
                            onClick={() => remove(img._id)}
                            className="
                      text-red-500
                      text-sm
                      hover:underline
                    "
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
