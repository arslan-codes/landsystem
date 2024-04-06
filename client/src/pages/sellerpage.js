import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CryptoLands from "./CryptoLands.json";
import Layout from "../components/layout/layout";
import { toast } from "react-toastify";

const SellerPage = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState("");
  const [detailsCID, setDetailsCID] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
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

  const registerProperty = async (event) => {
    event.preventDefault();
    try {
      await contract.methods
        .registerProperty(detailsCID, web3.utils.toWei(price, "ether"))
        .send({ from: account });
      console.log("Property registered successfully");
      toast.success(`request for nft is sent`);
      // Refresh properties after registering a new one
      fetchProperties();
    } catch (error) {
      console.error("Error registering property:", error);
      toast.error("Error registering property:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const propertiesData = await contract.methods
        .OwnedProperties(account)
        .call();
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchProperties();
    }
  }, [contract, account]);

  /* */
  return (
    <Layout>
      <div>
        <h1>Seller Page</h1>
        <h2>Register New Property</h2>
        <form onSubmit={registerProperty}>
          <div className="input-group m-3 w-50">
            <div className="input-group-prepend">
              <span className="input-group-text ml-2" id="basic-addon1">
                Price (ETH):
              </span>
            </div>
            <input
              type="number"
              step="any"
              className="form-control w-25"
              aria-describedby="basic-addon1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="input-group m-3 w-50">
            <div className="input-group-prepend">
              <span className="input-group-text ml-2" id="basic-addon1">
                Details CID:
              </span>
            </div>
            <input
              className="form-control w-25"
              aria-describedby="basic-addon1"
              type="text"
              value={detailsCID}
              onChange={(e) => setDetailsCID(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success m-2" type="submit">
            Register Property
          </button>
        </form>
        <h2>My Properties</h2>

        <div className="card-container">
          {properties &&
            properties.map((property) => (
              <div key={property.tokenID} className="card">
                <img className="card-img-top" src="./house4.jpg" alt="" />
                <div className="card-body">
                  <h5 className="card-title">Property {property.tokenID}</h5>
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
    </Layout>
  );
};

export default SellerPage;
