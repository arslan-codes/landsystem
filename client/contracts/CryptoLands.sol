// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract CryptoLands is ERC721, Ownable, ERC721URIStorage  {
     constructor() ERC721("CryptoLands", "CYD") Ownable(msg.sender) {}

    // Modifier to check if the caller is the land inspector
    modifier onlyLandInspector() {
        require(msg.sender == owner(), "Caller is not the land inspector");
        _;
    }
       function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view  override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /*
when user will list the property the property will 
be added here and the land insepctor will approve its status 
    */
     struct Property {
        address owner;
        uint256 Price;
        string detailsCID; // IPFS CID of property details
        bool verified;  //APPROVED OR UNAPPROVED PROPERTY 
        bool saleStatus;
        uint256 tokenID;
    }


    
    mapping(uint256 => Property) public properties;  //uint256 is the tokenID 
    mapping(uint256 => bool) private _propertyApprovalStatus;
    mapping(string => bool) private _usedCIDs; //
    mapping (uint256 => bool) public  PropertyStatus_available;  //to check if the property is availbe to sell  or not
    uint256 private _nextTokenId; //id of house nft number
    uint256 private _RegID;

   
 // Event emitted when a property is registered
 event PropertyRegistered(uint256 indexed tokenId, address indexed owner);
 // Event emitted when a property is approved by the land inspector
 event PropertyApproved(uint256 indexed tokenId);
 // Event emitted when a property is sold
 event PropertySold(uint256 indexed tokenId, address indexed newOwner);

 // Modifier to check if the property is available for sale
    modifier propertyAvailable(uint256 tokenId) {
        require(PropertyStatus_available[tokenId], "Property is not available for sale");
        _;
    }


// Function to register/list  a new property as an NFT
function registerProperty(string memory propertyURI,uint256 _price) public  returns (uint256) {
   require(!_usedCIDs[propertyURI], "Property with this CID already exists");
    _usedCIDs[propertyURI] = true;
        address propOwner=msg.sender;
        bool _verified=false;
    bool _saleStatus=false;
     uint256 RegID = _RegID++;
        properties[RegID]=Property(propOwner,_price,propertyURI,_verified,_saleStatus,RegID); 
        //0=>  
        return RegID;
}
   

    // Function for the land inspector to approve a property
function approveProperty(uint256 Reg_ID) public  onlyLandInspector 
{     address propOwner=properties[Reg_ID].owner;  
uint256 tokenId = _nextTokenId++;
     properties[Reg_ID]=Property(propOwner,properties[Reg_ID].Price,properties[Reg_ID].detailsCID,true,false,tokenId);
    _mint(propOwner, tokenId);
    _setTokenURI(tokenId,  properties[tokenId].detailsCID);
    emit PropertyRegistered(tokenId, propOwner);
    _propertyApprovalStatus[tokenId] = true;
    emit PropertyApproved(tokenId);
}

    /*function to sell the property  
    user will first change the status of his property request to sell 
    land inspector will verify if it should be selled or not 
    */
    function sell(uint256 tokenId) public view  returns (string memory) {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this property"); //verifiy ownership
        require(_propertyApprovalStatus[tokenId], "Property has not been approved yet");
        string  memory msgstatus="request for approval has been sent";
        return msgstatus;
    }


    function ApproveStatus(uint256 tokenid) public onlyLandInspector returns (string memory){
          PropertyStatus_available[tokenid]=true;
          string memory status="the property is ready to sell";
          properties[tokenid].saleStatus=true;
          return status  ;
    }
   
       // Function for a user to sell their property
 function _BuyProperty(uint256 tokenId) public  payable {
      address buyer = msg.sender;
    address payable seller = payable(ownerOf(tokenId));
    // Ensure the buyer is not the owner of the property
    require(ownerOf(tokenId) != buyer, "You can't buy your own property");
    // Ensure the property has been approved for sale
    require(_propertyApprovalStatus[tokenId]==true, "Property has not been approved yet");
  require(PropertyStatus_available[tokenId]==true,"NOT FOR SALE");
    // Ensure the buyer sent enough funds to purchase the property
    require(msg.value >= properties[tokenId].Price, "Insufficient funds to buy this property");

// approving buyer to sell the token id 
     _approve(buyer, tokenId, seller);
// QmbvU27SDvZwexSE4Ky2RWm2EzZ7DtdbSgA63FoNLCQKjv



//escrow mechanisim
    // Transfer funds to the seller
    // Transfer token from seller to buyer
    seller.transfer(msg.value); //msg.value
    safeTransferFrom(seller, buyer, tokenId);
   //sold properties availibity setting to false
updatePropertyDetails(tokenId, buyer, false);
    // Emit event for property sold
    emit PropertySold(tokenId, buyer);
}
   function updatePropertyDetails(uint256 tokenId, address newOwner, bool newSaleStatus) private {
        properties[tokenId].owner = newOwner;
        properties[tokenId].saleStatus = newSaleStatus;
    }

    // Function to check if a property is approved
    function isPropertyApproved(uint256 tokenId) external view returns (bool) {
        return _propertyApprovalStatus[tokenId];
        }



// from this method getting  all the  properties
function getAllProperties() public view  returns  (Property[] memory) {
    Property[] memory allProperties = new Property[](_RegID);
    for (uint256 i = 0; i < _RegID; i++) {
        allProperties[i] = properties[i];
    }
    return allProperties;
}
 function OwnedProperties(address owner) public view returns (Property[] memory) {
        uint256 count = 0;
        // total number of properties
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (properties[i].owner == owner) {
                count++;
            }
        }
        //array will store all thr properties
        Property[] memory ownedProperties = new Property[](count);
        uint256 index = 0;
        // Iterate through all properties and add the ones owned by the given address to the array
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (properties[i].owner == owner) {
                ownedProperties[index] = properties[i];
                index++;
            }
        }
        return ownedProperties;
    }

}

