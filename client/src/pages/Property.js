import React, { useState, useEffect } from "react";
import IPFSImage from "./IPFSImage";
import "../App.css"; // Import the CSS fil

const Property = () => {
  const [nfts, setNFTs] = useState([]);

  const handleAddCID = (inputValue) => {
    // Split the CID to separate the metadata from the image CID
    const [metadataCID, imageCID] = inputValue.split("/");

    // Fetch the metadata from IPFS
    fetch(`https://ipfs.io/ipfs/${metadataCID}`)
      .then((response) => response.json())
      .then((metadata) => {
        // Extract the CID of the image from the metadata
        const imageCID = metadata.image;
        const nft = {
          imageCID: imageCID,
          metadata: metadata,
        };
        setNFTs((prevNFTs) => [...prevNFTs, nft]);
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });
  };

  return (
    <div className="property-container">
      <div className="header">
        <h1>NFT Marketplace</h1>
      </div>
      <div className="main-content">
        <div className="add-cid">
          <input
            type="text"
            placeholder="Enter CID"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCID(e.target.value);
                e.target.value = ""; // Clear the input field
              }
            }}
          />
        </div>
        <div className="marketplace-container">
          {/* Display NFT items */}
          {nfts.map((nft, index) => (
            <div className="nft-item" key={index}>
              <IPFSImage cid={nft.imageCID} />
              <div className="metadata">
                <h3>Metadata:</h3>
                <p>Title: {nft.metadata.title}</p>
                <p>Description: {nft.metadata.description}</p>
                {/* Add more metadata fields here */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <p>© 2024 NFT Marketplace. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Property;
/**
 * import React, { useState } from "react";
import IPFSImage from "./IPFSImage";
import "../App.css"; // Import the CSS fil

const Property = () => {
  const [cids, setCids] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddCID = () => {
    setCids((prevCids) => [...prevCids, inputValue]);
    setInputValue(""); // Clear the input field after adding CID
  };

  return (
    <div className="property-container">
      <div className="header">
        <h1>NFT Marketplace</h1>
      </div>
      <div className="main-content">
        <div className="add-cid">
          <input
            type="text"
            placeholder="Enter CID"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleAddCID}>Add CID</button>
        </div>
        <div className="marketplace-container">
          {/* Display NFT items */
//}
//           {cids.map((cid, index) => (
//             <div className="nft-item" key={index}>
//               <IPFSImage cid={cid} />
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="footer">
//         <p>© 2024 NFT Marketplace. All rights reserved.</p>
//       </div>
//     </div>
//   );

// };

// export default Property;
