// SPDX-License-Identifier: MIT
// By Will Papper
// Deployed to 0xF2F3eD32C29ee77C55f37700eF090417FdfE81F2

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
            return "ipfs://QmbFk3Tcnf5WhybqLvhGodf3naru3bFtHudSbBuzAwqxLy/on-chain-cow-happy-cow.json";
        } else {
            // All other NFTs are Neutral Cows
            return "ipfs://QmbFk3Tcnf5WhybqLvhGodf3naru3bFtHudSbBuzAwqxLy/on-chain-cow-neutral-cow.json";
        }
    }
}
