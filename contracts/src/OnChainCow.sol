// SPDX-License-Identifier: MIT
// By Will Papper
// Deployed to 0x4bD5728b10539caF2Aa767eb2877505d1005207D

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
            return "ipfs://QmeK3oULmm64wCKViRfKxo8TtwgUGt8E2HQLpbVphc34h9/on-chain-cow-happy-cow.png";
        } else {
            return "ipfs://QmeK3oULmm64wCKViRfKxo8TtwgUGt8E2HQLpbVphc34h9/on-chain-cow-neutral-cow.png";
        }
    }
}
