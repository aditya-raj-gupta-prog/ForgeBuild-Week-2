// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Ledger {
    mapping(address => uint256) public s_addressToAmountDeposited;
    
    address[] public s_funders;

    event Deposit(address indexed user, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "You must send some ETH");
        
        if (s_addressToAmountDeposited[msg.sender] == 0) {
            s_funders.push(msg.sender);
        }

        s_addressToAmountDeposited[msg.sender] += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}