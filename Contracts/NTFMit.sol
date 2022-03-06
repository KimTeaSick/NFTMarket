// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "saleNFT.sol";

contract NFT is ERC721Enumerable {
    SaleToken public saleToken;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("CResearch", "CNR") {}

    mapping(uint256 => string) tokenURIs;

    struct TokenData {
        uint256 TokenNum;
        string tokenInfo;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return tokenURIs[tokenId];
    }

    function create(address to, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        tokenURIs[newItemId] = tokenURI;

        return newItemId;
    }

    //
    function getTokens(address _TokenOwner)
        public
        view
        returns (TokenData[] memory)
    {
        uint256 balanceLength = balanceOf(_TokenOwner);

        require(balanceLength != 0, "Owner did not have token.");

        TokenData[] memory tokenData = new TokenData[](balanceLength);

        for (uint256 i = 0; i < balanceLength; i++) {
            uint256 TokenNum = tokenOfOwnerByIndex(_TokenOwner, i);
            string memory tokenInfo = tokenURI(TokenNum);

            tokenData[i] = TokenData(TokenNum, tokenInfo);
        }
        return tokenData;
    }

    function setSaleToken(address _saleToken) public {
        saleToken = SaleToken(_saleToken);
    }
}
