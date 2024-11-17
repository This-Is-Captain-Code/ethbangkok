// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FlowNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("FlowNFT", "Flow3D") {}

    // Struct to hold NFT metadata
    struct Metadata {
        string downloadLink;
        string image;
        string name; // Token name
    }

    // Mapping for token metadata
    mapping(uint256 => Metadata) private tokenMetadata;

    // Mint new NFTs
    function mint(string memory downloadLink, string memory image, string memory tokenName) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Mint the NFT to the sender
        _safeMint(msg.sender, tokenId);

        // Store metadata
        tokenMetadata[tokenId] = Metadata({
            downloadLink: downloadLink,
            image: image,
            name: tokenName // Assign name as per input
        });

        // Set token URI
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
    }

    // Generate token URI as a JSON string
    function _generateTokenURI(uint256 tokenId) private view returns (string memory) {
        Metadata memory metadata = tokenMetadata[tokenId];

        // Return JSON metadata in string format
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            '{"name":"', metadata.name, '",',
            '"description":"Download link: ', metadata.downloadLink, '",',
            '"image":"', metadata.image, '"}'
        ));
    }
}
