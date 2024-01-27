// SPDX-License-Identifier: MIT
// By Will Papper

pragma solidity ^0.8.20;

import {ERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract OnChainCow is ERC721 {
    uint256 currentTokenId = 0;

    constructor() ERC721("OnChainCow", "COW") {}

    function mint(address to) public {
        ++currentTokenId;
        _mint(to, currentTokenId);
    }

    function tokenURI(uint256 tokenId) public pure override returns (string memory) {
        // Every 5th NFT is a Happy Cow
        if (tokenId % 5 == 0) {
            return "ipfs://QmfWe2k3a2cwor4yF226bnEtwppHVcNHRBZ1VbGLrv5Shu";
        } else {
            // All other NFTs are Neutral Cows
            return "ipfs://QmYvkg85xQbaj4N8D4qnh5hToUeqLhSyHQ7drdtrcD2Kd8";
        }
    }
}
