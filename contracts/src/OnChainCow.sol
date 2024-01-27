// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract OnChainCow is ERC721 {
    uint256 currentTokenId = 0;

    constructor() ERC721("OnChainCow", "COW") {}

    function mint(address to) public {
        ++currentTokenId;
        _mint(to, currentTokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Use Syndicate's API for dynamic metadata
        // See the documentation at https://docs.syndicate.io/guides/dynamic-nft-metadata
        return
            string(abi.encodePacked("https://metadata.syndicate.io/", block.chainid, "/", address(this), "/", tokenId));
    }
}
