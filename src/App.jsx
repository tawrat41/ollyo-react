/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaImage } from "react-icons/fa"; 
import reactLogo from "./assets/react.svg"; 
import viteLogo from "/vite.svg";
import "./App.css";

// Importing images
import img1 from "./assets/images/image-1.webp";
import img2 from "./assets/images/image-2.webp";
import img3 from "./assets/images/image-3.webp";
import img4 from "./assets/images/image-4.webp";
import img5 from "./assets/images/image-5.webp";
import img6 from "./assets/images/image-6.webp";
import img7 from "./assets/images/image-7.webp";
import img8 from "./assets/images/image-8.webp";

const App = () => {
  // Setting up state for images and selected images
  const [images, setImages] = useState([
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
  ]);

  const [selectedImages, setSelectedImages] = useState([]);

  // Function to handle clicking on images for selection
  const handleImageClick = (index) => {
    const newSelectedImages = [...selectedImages];

    if (newSelectedImages.includes(index)) {
      newSelectedImages.splice(newSelectedImages.indexOf(index), 1);
    } else {
      newSelectedImages.push(index);
    }

    setSelectedImages(newSelectedImages);
  };

  // Function to handle deleting selected images
  const handleDeleteImages = () => {
    setImages(images.filter((_, index) => !selectedImages.includes(index)));
    setSelectedImages([]);
  };

  // Function to handle the start of a drag operation
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("isSelected", selectedImages.includes(index));
    e.target.classList.add("dragged");
  };

  // Function to handle the end of a drag operation
  const handleDragEnd = (e) => {
    e.target.classList.remove("dragged");
  };

  // Function to handle dropping an image into a new position
  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("index");
    const updatedImages = [...images];
    const [draggedImage] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(newIndex, 0, draggedImage);
    setImages(updatedImages);

    const updatedSelectedImages = selectedImages.map((index) => {
      if (index === parseInt(draggedIndex)) {
        return newIndex;
      } else if (index === newIndex) {
        return parseInt(draggedIndex);
      }
      return index;
    });
    setSelectedImages(updatedSelectedImages);
  };

  // Function to handle uploading a new image
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages([...images, event.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-gallery">
      {/* Top container showing number of selected images and delete button */}
      <div className="top-container">
        {selectedImages.length === 0 ? (
          <h2>Image Gallery</h2>
        ) : (
          <>
            <p>
              <input type="checkbox" checked readOnly /> {selectedImages.length}{" "}
              Image selected
            </p>
            <button onClick={handleDeleteImages}>Delete Files</button>
          </>
        )}
      </div>

      {/* Bottom container displaying images */}
      <div className="bottom-container">
        {/* Featured image (first image) */}
        <div
          className={`image-container featured ${
            selectedImages.includes(0) ? "selected" : ""
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, 0)}
          onDrop={(e) => handleDrop(e, 0)}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => handleImageClick(0)}
          onDragEnd={handleDragEnd}
        >
          <img src={images[0]} alt={`Image 0`} />
          <div className="checkbox">
            <input
              type="checkbox"
              checked={selectedImages.includes(0)}
              readOnly
            />
          </div>
        </div>

        {/* Remaining images */}
        {images.slice(1).map((src, index) => (
          <div
            key={index}
            className={`image-container ${
              selectedImages.includes(index + 1) ? "selected" : ""
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index + 1)}
            onDrop={(e) => handleDrop(e, index + 1)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => handleImageClick(index + 1)}
          >
            <img src={src} alt={`Image ${index + 1}`} />
            <div className="checkbox">
              <input
                type="checkbox"
                checked={selectedImages.includes(index + 1)}
                readOnly
              />
            </div>
          </div>
        ))}

        {/* Add image button */}
        <div
          className={`image-container add-image-button ${
            selectedImages.includes(images.length) ? "selected" : ""
          }`}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <FaImage /> <br />
          <p>Add Image</p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default App;
