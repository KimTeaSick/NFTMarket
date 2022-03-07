// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "NTFMit.sol";

contract SaleToken {
    
    NFT public NFTAddress;

    constructor (address _mintTokenAddress) {
        NFTAddress = NFT(_mintTokenAddress);
    }

    mapping(uint256 => uint256) public tokenPrices;

    uint256[] public onSaleTokenArray;

    function setForSaleToken(uint256 _tokenNum, uint256 _price) public {
        address tokenOwner = NFTAddress.ownerOf(_tokenNum);

        require(tokenOwner == msg.sender, "Caller is not token owner.");
        require(_price > 0, "Price is zero or lower.");
        require(tokenPrices[_tokenNum] == 0, "This animal token is already on sale.");
        require(NFTAddress.isApprovedForAll(tokenOwner, address(this)), "token owner dNum not approve token.");

        tokenPrices[_tokenNum] = _price;

        onSaleTokenArray.push(_tokenNum);
    }

    function purchaseToken(uint256 _tokenNum) public payable {
        uint256 price = tokenPrices[_tokenNum];
        address tokenOnwer = NFTAddress.ownerOf(_tokenNum);

        require(price > 0, " token not sale.");
        require(price <= msg.value, "Caller sent lower than price.");
        require(tokenOnwer != msg.sender, "Caller is token owner.");

        payable(tokenOnwer).transfer(msg.value);
        NFTAddress.safeTransferFrom(tokenOnwer, msg.sender, _tokenNum);

        tokenPrices[_tokenNum] = 0;

        for(uint256 i = 0; i < onSaleTokenArray.length; i++) {
            if(tokenPrices[onSaleTokenArray[i]] == 0) {
                onSaleTokenArray[i] = onSaleTokenArray[onSaleTokenArray.length - 1];
                onSaleTokenArray.pop();
            }
        }
    }

    function getOnSaleTokenArrayLength() view public returns (uint256) {
        return onSaleTokenArray.length;
    }

    function getTokenPrice(uint256 _tokenNum) view public returns (uint256) {
        return tokenPrices[_tokenNum];
    }
}