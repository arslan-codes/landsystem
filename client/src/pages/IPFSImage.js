// IPFSImage.js
import React, { useState, useEffect } from "react";

const IPFSImage = ({ cid }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchImage();

    // Clean up URL object when component unmounts
    return () => URL.revokeObjectURL(imageSrc);
  }, [cid]);

  return (
    <div>
      {imageSrc && (
        <img
          className="rounded mx-auto d-blockimg-fluid img-thumbnail"
          src={imageSrc}
          alt="IPFS Image"
        />
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default IPFSImage;
