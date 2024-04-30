import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import CryptoLands from "./CryptoLands.json";
import Layout from "../components/layout/layout";
import { toast } from "react-toastify";

const Marketplace = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [account, setAccount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyTokenId, setBuyTokenId] = useState("");
  const [contractLoaded, setContractLoaded] = useState(false);
  // metadata

  const [Imagecid, Setimagecid] = useState();
  const [propertyData, setTempProperty] = useState(null);
  const [cid, setCid] = useState(null);
  const [nfts, setNFTs] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          console.log(accounts[0]);
          console.log();
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
        const deployedNetwork = CryptoLands.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          CryptoLands.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
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
        const propertiesWithMetadata = [];

        for (const property of allPropertiesData) {
          const metadata = await fetchMetadata(property.detailsCID);
          const imageHash = metadata.image.replace("ipfs://", "");
          const imageUrl = `https://ipfs.io/ipfs/${imageHash}`;
          propertiesWithMetadata.push({ ...property, metadata, imageUrl });
        }

        setAllProperties(propertiesWithMetadata);
      } else {
        console.error("Contract not initialized");
      }
    } catch (error) {
      console.error("Error fetching all properties:", error);
    }
  };

  const fetchMetadata = async (detailsCID) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${detailsCID}`);
      const metadata = await response.json();
      // Extracting the image hash from metadata
      const imageHash = metadata.image.replace("ipfs://", "");
      // Constructing the complete URL for the image
      const imageUrl = `https://ipfs.io/ipfs/${imageHash}`;
      return { ...metadata, imageUrl };
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };

  const SinglefetchMetadata = useCallback(() => {
    fetch(`https://ipfs.io/ipfs/${cid}`)
      .then((response) => response.json())
      .then((metadata) => {
        Setimagecid(metadata.image);
        const hashvalueimage = Imagecid.replace("ipfs://", "");
        setImageUrl(`https://ipfs.io/ipfs/${hashvalueimage}`);
        console.log("god the metadata");
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });
  }, [cid]);

  useEffect(() => {
    if (cid) {
      fetchMetadata();
    }
  }, [cid, fetchMetadata]);

  const handleBuyProperty = async () => {
    console.log("the token id is ", buyTokenId);

    try {
      console.log("Buying property...", buyTokenId);
      const result = await contract.methods._BuyProperty(buyTokenId).send({
        from: account,
        value: web3.utils.toWei(buyAmount.toString(), "ether"),
      });
      console.log("Property bought:", result.transactionHash);
      toast.success(`Property bought: ${result.transactionHash}`);
    } catch (error) {
      console.error("Failed to purchase:", error);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchAllProperties();
    }
  }, [contract, account]);

  return (
    <Layout>
      <h1 className="text-center has-text-weight-bold">Marketplace</h1>{" "}
      <div className="col">
        <h2>Buy Property</h2>
        <div className="input-group m-3 w-50">
          <div className="input-group-prepend">
            <span className="input-group-text ml-2" id="basic-addon1">
              Token ID
            </span>
          </div>

          <input
            type="number"
            placeholder="Token ID"
            className="form-control w-25"
            aria-describedby="basic-addon1"
            value={buyTokenId}
            onChange={(e) => setBuyTokenId(e.target.value)}
          />
        </div>
        <div className="input-group m-3 w-50">
          <div className="input-group-prepend">
            <span className="input-group-text ml-2" id="basic-addon1">
              Buy Amount (ETH)
            </span>
          </div>
          <input
            type="number"
            placeholder="Buy Amount (ETH)"
            className="form-control w-25"
            aria-describedby="basic-addon1"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
          />
        </div>

        <button class="button w-" onClick={handleBuyProperty}>
          <span> Buy Property</span>
        </button>
        {/* <button className="btn btn-success m-2" onClick={handleBuyProperty}>
            Buy Property
          </button> */}
      </div>
      <h2 className="mx-3 text-center">All Properties</h2>
      <div className="container">
        <div>
          <div className="card-container " style={{ width: "75%" }}>
            {allProperties.map((property, index) => (
              // <div className="card ">
              <div key={index} className="card">
                <img className="card-img-top" src={property.imageUrl} alt="" />
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="card-title">Property Details</h5>
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
                        <strong>Verified:</strong>{" "}
                        {property.verified ? "Yes" : "No"}
                      </p>
                      <p className="card-text">
                        <strong>Sale Status:</strong>{" "}
                        {property.saleStatus ? "For Sale" : "Not for Sale"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="card-title">Metadata</h5>
                      {property.metadata && (
                        <div>
                          <p className="card-text">
                            <strong>Name:</strong> {property.metadata.name}
                            <br />
                            <strong>Description:</strong>{" "}
                            {property.metadata.description}
                          </p>
                          <p className="card-text">
                            <strong>Location:</strong>{" "}
                            {property.metadata.location}
                          </p>
                          <p className="card-text">
                            <strong>Area:</strong> {property.metadata.area}
                          </p>
                          <p className="card-text">
                            <strong>Bedrooms:</strong>{" "}
                            {property.metadata.bedrooms}
                          </p>
                          <p className="card-text">
                            <strong>Bathrooms:</strong>{" "}
                            {property.metadata.bathrooms}
                          </p>
                          <p className="card-text">
                            <strong>Features:</strong>{" "}
                            {property.metadata.features.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
