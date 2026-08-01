// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipJar {
    address public owner;
    bool private locked;
    
    event TipReceived(address indexed sender, uint256 amount, string note);
    
    modifier nonReentrant() {
        require(!locked, "Reentrancy guard");
        locked = true;
        _;
        locked = false;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function tip(string calldata note) external payable {
        // Enforce the note length bound
        require(bytes(note).length <= 256, "Note is too long");
        require(msg.value > 0, "Must send some ETH to tip");
        
        // Emitted amount is strictly from msg.value
        // Recorded sender is strictly from msg.sender
        emit TipReceived(msg.sender, msg.value, note);
    }
    
    function withdraw() external nonReentrant {
        // Only the owner can withdraw
        require(msg.sender == owner, "Not owner");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // State written (locked = true) before external transfer occurs via modifier
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
}
