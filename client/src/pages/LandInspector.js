import React, { useState, useEffect } from "react";
import Web3 from "web3";
// import IPFSImage from "./IPFSImage";
import CryptoLands from "./CryptoLands.json";
import axios from "axios";
import { toast } from "react-toastify";

import Layout from "../components/layout/layout";
import "../styles/home.css";
const LandInspectorPage = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [SaleStatus, setSaleStatus] = useState("");
  const [approveTokenId, setApproveTokenId] = useState(0);
  const [account, setAccount] = useState("");
  // const [nfts, setNFTs] = useState(null); // Metadata
  // const [cid, setCid] = useState(""); // to get the cied to view data

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          console.error("use is ", accounts[0]);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.error("Please install MetaMask extension");
      }
    };

    const initContract = async () => {
      try {
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        const deployedNetwork = CryptoLands.networks[networkId];

        if (!deployedNetwork) {
          throw new Error(
            `Contract network not found for network ID: ${networkId}`
          );
        }

        const contractInstance = new web3.eth.Contract(
          CryptoLands.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
        console.log("Contract is initialized");
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    if (web3) {
      initContract();
    } else {
      initWeb3();
    }
  }, [web3]);

  const fetchAllProperties = async () => {
    try {
      if (contract) {
        const allPropertiesData = await contract.methods
          .getAllProperties()
          .call();
        setAllProperties(allPropertiesData);
      } else {
        console.error("Contract not initialized");
      }
    } catch (error) {
      console.error("Error fetching all properties:", error);
    }
  };
  const handleApproveProperty = async () => {
    if (!contract) {
      console.error("Contract not loaded");
      return;
    }

    try {
      const result = await contract.methods
        .approveProperty(approveTokenId)
        .send({ from: account });
      console.log("Property Approved:", result);
      toast.success("Property Approved:", result);
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error("Error approving property:", error);
    }
  };

  // const handleApproveProperty = async () => {
  //   if (!contract) {
  //     console.log("error contract not loaded");
  //   }
  //   try {
  //     const result = await contract.methods
  //       .approveProperty(approveTokenId)
  //       .send({
  //         from: account,
  //       });
  //     console.log("Propertty Aproved ", result);
  //   } catch (error) {
  //     console.error("erro approving property ", error);
  //   }
  // };

  const ApproveProperty = async () => {
    if (!contract || !account) {
      console.error("Contract or account not loaded");
      return;
    }

    try {
      const val = await contract.methods
        .ApproveStatus(SaleStatus)
        .send({ from: account });
      toast.success("Property approved for sale");
      console.log("Property approved for sale");
    } catch (error) {
      console.error("Error approving property for sale:", error);
      toast.error("Error approving property for sale:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center m-4 primaryText font-weight-bold">
        LandInspector Page
      </h1>
      <h2 className="mx-3">Approve Property Token</h2>
      <div className="input-group m-3 w-25">
        <input
          type="number"
          className="form-control"
          placeholder="Token ID"
          aria-label="Token ID"
          aria-describedby="basic-addon1"
          value={approveTokenId}
          onChange={(e) => setApproveTokenId(e.target.value)}
        />
      </div>
      <button className="btn btn-success m-2" onClick={handleApproveProperty}>
        Approve Property Token
      </button>

      <h2 className="mx-3">Approve Property for sale</h2>
      <div className="input-group m-3 w-25">
        <div className="input-group-prepend">
          <span className="input-group-text ml-2" id="basic-addon1">
            For Sale
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Token ID"
          aria-label="Token ID"
          aria-describedby="basic-addon1"
          value={SaleStatus}
          onChange={(e) => setSaleStatus(e.target.value)}
        />
      </div>
      <button className="btn btn-success m-2" onClick={ApproveProperty}>
        Approve Property for Sale
      </button>
      <button className="btn btn-success m-4" onClick={fetchAllProperties}>
        Fetch All Properties
      </button>

      <div>
        <h2 className="mx-3">All Properties</h2>
        <div className="card-container">
          {allProperties.map((property, index) => (
            <div key={index} className="card">
              {/* <img className="card-img-top" src="./hero_img.avif" alt="" /> */}
              {/* <IPFSImage
                  cid={"QmTa4ddADQREvZGu7TgnDeiKxChYA2pvGHLVpmYkcKKdgX"} // Use CID from property data
                /> */}{" "}
              <img className="card-img-top" src="./house4.jpg" alt="" />
              <div className="card-body">
                <h5 className="card-title">Property {index + 1}</h5>
                <p className="card-text">
                  <strong>ID:</strong> {property.tokenID.toString()}
                </p>
                <p className="card-text">
                  <strong>Owner:</strong> {property.owner}
                </p>
                <p className="card-text">
                  <strong>Details CID:</strong> {property.detailsCID}
                </p>
                <p className="card-text">
                  <strong>Verified:</strong> {property.verified ? "Yes" : "No"}
                </p>
                <p className="card-text">
                  <strong>Sale Status:</strong>{" "}
                  {property.saleStatus ? "For Sale" : "Not for Sale"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandInspectorPage;
/*
 {allProperties.map((property, index) => (
            <div key={index}>
               <li className="list-group-item">
                <p>ID: {property.id}</p>
              </li>
              <li className="list-group-item">
                {" "}
                <p>Owner: {property.owner}</p>
              </li>
              <li className="list-group-item">
                {" "}
                <p>Details CID: {property.detailsCID}</p>
              </li>
              <li className="list-group-item">
                {" "}
                <p>Verified: {property.verified ? "Yes" : "No"}</p>
              </li>
              <li className="list-group-item">
                {" "}
                <p>
                  Sale Status:{" "}
                  {property.saleStatus ? "For Sale" : "Not for Sale"}
                </p>
              </li>
            </div>
          ))}


*/
