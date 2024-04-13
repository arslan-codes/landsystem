import React, { useState, useEffect } from "react";
import IPFSImage from "./IPFSImage";
import "../App.css"; // Import the CSS file

const Property = () => {
  const [nft, setNFT] = useState(null);

  const handleAddCID = () => {
    const cid = "QmYtYXLD3UD5i4sPYeMe5fczdV7dKT9Zy2R2gFqQwvPUQB";

    // Fetch the metadata from IPFS
    fetch(`https://ipfs.io/ipfs/${cid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }
        return response.json();
      })
      .then((metadata) => {
        setNFT(metadata);
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });
  };

  useEffect(() => {
    // Fetch metadata when component mounts
    handleAddCID();
  }, []);

  return (
    <div className="property-container">
      <div className="header">
        <h1>NFT Marketplace</h1>
      </div>
      <div className="main-content">
        <div className="metadata">
          {nft && (
            <>
              <h3>Metadata:</h3>
              <p>Title: {nft.title}</p>
              <p>Description: {nft.description}</p>
              {/* Add more metadata fields here */}
            </>
          )}
        </div>
      </div>
      <div className="footer">
        <p>© 2024 NFT Marketplace. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Property;
