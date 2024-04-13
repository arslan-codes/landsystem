import "./assets/vendor/bootstrap/css/bootstrap.min.css";
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "./assets/vendor/boxicons/css/boxicons.min.css";
import "./assets/vendor/glightbox/css/glightbox.min.css";

import "./assets/css/style.css";
import profileImg from "./assets/img/profile-img.jpg";

import React, { useRef, useState, useEffect } from "react";
import Web3, { ERR_INVALID_RESPONSE } from "web3";
// import IPFSImage from "./IPFSImage";
import CryptoLands from "./CryptoLands.json";

import { toast } from "react-toastify";

function LandInspector() {
  //components
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  //for all properties
  const [allProperties, setAllProperties] = useState([]);

  //for individual properties
  const [SaleStatusid, setSaleStatusid] = useState("");
  const [approveTokenId, setApproveTokenId] = useState(0);

  //to retreive data
  const [propertyData, setTempProperty] = useState(null);
  const [cid, setCid] = useState(null);
  const [nfts, setNFTs] = useState(null);
  const [account, setAccount] = useState("");

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

  const ReturnPropertyData = async (e) => {
    setApproveTokenId(e);
    console.log(e);
    if (!contract) {
      console.log("error contract not loaded");
    }

    try {
      console.log("Checking property data...");
      const property = await contract.methods.properties(approveTokenId).call();
      setTempProperty(property);
      setCid(property.detailsCID);
      console.log(property.detailsCID);
      console.log("Property data:", property);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };

  const ApproveProperty = async () => {
    if (!contract || !account) {
      console.error("Contract or account not loaded");
      return;
    }

    try {
      const val = await contract.methods
        .ApproveStatus(SaleStatusid)
        .send({ from: account });
      toast.success("Property approved for sale");
      console.log("Property approved for sale");
    } catch (error) {
      console.error("Error approving property for sale:", error);
      toast.error("Error approving property for sale:", error);
    }
  };

  return (
    <div className="App">
      <div>
        <header id="header">
          <div class="d-flex flex-column">
            <div class="profile">
              <img src={profileImg} alt="" class="img-fluid rounded-circle" />
              <h1 class="text-light">
                <a href="index.html">Land Inspector</a>
              </h1>
              <div class="social-links mt-3 text-center"></div>
            </div>

            <nav id="navbar" class="nav-menu navbar">
              <ul>
                <li>
                  <a href="#Viewall" class="nav-link scrollto active">
                    <i class="bx bx-home"></i> <span>View All Properties</span>
                  </a>
                </li>
                <li>
                  <a href="#approve" class="nav-link scrollto">
                    <i class="bx bx-home-alt-2"></i>
                    <span>Aprrove Property Token</span>
                  </a>
                </li>
                <li>
                  <a href="#forsale" class="nav-link scrollto">
                    <i class="bx bx-book-content"></i>
                    <span>Aprrove Property for Sale</span>
                  </a>
                </li>
                <li>
                  <a href="#Reject" class="nav-link scrollto">
                    <i class="bx bx-server"></i> <span>Reject</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
      {/* ending header section here */}
      {/* MAIN SECTION STARTS HERE  */}
      <main id="main">
        <section id="Viewall">
          <div class="container">
            <div class="section-title">
              <h2 className="mx-3">All Properties</h2>
              <div id="col1">
                <div>
                  <button
                    className="btn btn-success m-4"
                    onClick={fetchAllProperties}
                  >
                    Fetch All Properties
                  </button>
                  <div className="card-container">
                    {allProperties.map((property, index) => (
                      <div key={index} className="card">
                        {/* <img className="card-img-top" src="./hero_img.avif" alt="" /> */}
                        {/* <IPFSImage
                  cid={"QmTa4ddADQREvZGu7TgnDeiKxChYA2pvGHLVpmYkcKKdgX"} // Use CID from property data
                /> */}{" "}
                        <img
                          className="card-img-top"
                          src="./house4.jpg"
                          alt=""
                        />
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
                            <strong>Verified:</strong>{" "}
                            {property.verified ? "Yes" : "No"}
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
            </div>
          </div>
        </section>

        {/* section approve token */}
        <section id="approve" class="about">
          <div class="container">
            <div class="section-title">
              <h2 className="mx-3">Approve Property Token</h2>
              <div id="col2" className="section">
                <div className="input-group m-3 w-50">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Token ID"
                    aria-label="Token ID"
                    aria-describedby="basic-addon1"
                    value={approveTokenId}
                    onChange={(e) => ReturnPropertyData(e.target.value)}
                  />
                </div>
                <div className="card-container" style={{ width: "75%" }}>
                  {propertyData && (
                    <div className="card">
                      <div className="card-body">
                        <div className="col-md-6">
                          <h5 className="card-title">Property Details</h5>
                          <p className="card-text">
                            <strong>Nft ID:</strong>{" "}
                            {propertyData.tokenID.toString()}
                          </p>
                          <p className="card-text">
                            <strong>Owner:</strong> {propertyData.owner}
                          </p>
                          <p className="card-text">
                            <strong>Price:</strong>{" "}
                            {propertyData.Price.toString()} Ether
                          </p>
                          <p className="card-text">
                            <strong>Details CID:</strong>{" "}
                            {propertyData.detailsCID}
                          </p>
                          <p className="card-text">
                            <strong>Verified:</strong>{" "}
                            {propertyData.verified ? "Yes" : "No"}
                          </p>
                          <p className="card-text">
                            <strong>Sale Status:</strong>{" "}
                            {propertyData.saleStatus
                              ? "For Sale"
                              : "Not for Sale"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <h5 className="card-title">Metadata</h5>
                          {nfts && (
                            <div>
                              <p className="card-text">
                                <strong>Name:</strong> {nfts.name}
                                <br />
                                <strong>Description:</strong> {nfts.description}
                              </p>
                              <p className="card-text">
                                <strong>Location:</strong> {nfts.location}
                              </p>
                              <p className="card-text">
                                <strong>Area:</strong> {nfts.area}
                              </p>
                              <p className="card-text">
                                <strong>Bedrooms:</strong> {nfts.bedrooms}
                              </p>
                              <p className="card-text">
                                <strong>Bathrooms:</strong> {nfts.bathrooms}
                              </p>
                              <p className="card-text">
                                <strong>Features:</strong>{" "}
                                {nfts.features.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-success m-2"
                  onClick={handleApproveProperty}
                >
                  Approve Property Token
                </button>
              </div>
            </div>
          </div>
        </section>
        <section id="forsale" class="forsale">
          <div class="container">
            <div class="section-title">
              <h2 className="mx-3">Approve Property for sale</h2>
              <div id="col3" className="section">
                <div className="input-group m-3 w-75">
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
                    value={SaleStatusid}
                    onChange={(e) => setSaleStatusid(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-success m-2"
                  onClick={ApproveProperty}
                >
                  Approve Property for Sale
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* */}
      </main>
    </div>
  );
}

export default LandInspector;
