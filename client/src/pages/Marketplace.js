import React, { useState, useEffect } from "react";
import Web3 from "web3";
import IPFSImage from "./IPFSImage";
import "../App.css"; // Import the CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import CryptoLands from "./CryptoLands.json";
import Layout from "../components/layout/layout";

const MarketPlace = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [propertyURI, setPropertyURI] = useState("");
  const [price, setPrice] = useState(0);
  const [approveTokenId, setApproveTokenId] = useState(0);
  const [buyTokenId, setBuyTokenId] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [account, setAccount] = useState("");
  const [contractLoaded, setContractLoaded] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error enabling Ethereum:", error);
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    const loadContract = async () => {
      if (web3) {
        try {
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = CryptoLands.networks[networkId];
          if (deployedNetwork) {
            const contractInstance = new web3.eth.Contract(
              CryptoLands.abi,
              deployedNetwork.address
            );
            setContract(contractInstance);
            console.error("Contract is here boss");
          } else {
            console.error("Contract not deployed on this network");
          }
        } catch (error) {
          console.error("Error loading contract:", error);
        }
      }
    };
    if (web3 && !contractLoaded) {
      loadContract();
      setContractLoaded(true);
    }
    loadWeb3();
  }, [web3]);

  const handleRegisterProperty = async () => {
    if (!contract) {
      console.error("Contract not loaded");
      return;
    }

    try {
      const result = await contract.methods
        .registerProperty(propertyURI, price)
        .send({ from: account });
      console.log("Property Registered:", result);

      contract.events
        .PropertyRegistered()
        .on("data", (event) => {
          const owner = event.returnValues.account;
          const RegId = event.returnValues.tokenId;

          window.alert(
            `property register requeset has been sent to land inspector by ${owner} with the regestir id ${RegId}`
          );
        })
        .on("error", (error) => {
          console.error("Error listening to PropertyRegistered event:", error);
        });

      handleAddCID();
    } catch (error) {
      console.error("Error registering property:", error);
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
    } catch (error) {
      console.error("Error approving property:", error);
    }
  };

  const handleBuyProperty = async () => {
    if (!contract) {
      console.log("Contract not loaded");
    }
    try {
      const result = await contract.methods
        ._BuyProperty(buyTokenId)
        .send({ from: account, value: buyAmount });
      window.alert(`propert bought:${result}`);
    } catch (error) {
      console.log("failed to purchase", error);
    }
  };

  const [cids, setCids] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddCID = async () => {
    setCids((prevCids) => [...prevCids, inputValue]);
    setInputValue(""); // Clear the input field after adding CID
  };

  return (
    <Layout>
      <div>
        <h1 className="mb-4">CryptoLands Market Place</h1>
        <label>{account}</label>
        <button
          className="btn btn-primary"
          onClick={() =>
            window.ethereum.request({ method: "eth_requestAccounts" })
          }
        >
          Connect to MetaMask
        </button>
        <br></br>
        <input
          type="text"
          placeholder="Property URI"
          value={propertyURI}
          onChange={(e) => setPropertyURI(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleRegisterProperty} className="btn btn-success">
          Register Property
        </button>
        <div className="marketplace-container">
          {/* Display NFT items */}
          {cids.map((cid, index) => (
            <div className="nft-item" key={index}>
              <IPFSImage cid={cid} />
            </div>
          ))}
        </div>
        <div className="header">
          <h1>NFT Marketplace</h1>
        </div>

        <h2>Approve Property</h2>
        <input
          type="number"
          placeholder="Token ID"
          value={approveTokenId}
          onChange={(e) => setApproveTokenId(e.target.value)}
        />
        <button onClick={handleApproveProperty}>Approve Property</button>
        <h2>Buy Property</h2>
        <input
          type="number"
          placeholder="Token ID"
          value={buyTokenId}
          onChange={(e) => setBuyTokenId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Buy Amount (ETH)"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
        />
        <button onClick={handleBuyProperty}>Buy Property</button>
      </div>
    </Layout>
  );
};

export default MarketPlace;
