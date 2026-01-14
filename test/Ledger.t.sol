// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Ledger} from "../src/Ledger.sol";

contract LedgerTest is Test {
    Ledger public ledger;
    address USER = makeAddr("Aditya");
    uint256 constant SEND_VALUE = 0.1 ether;
    uint256 constant STARTING_BALANCE = 10 ether;

    function setUp() external {
        ledger = new Ledger();
        vm.deal(USER, STARTING_BALANCE); 
    }

    function testDepositUpdatesStoredBalance() public {
        vm.prank(USER); 
        ledger.deposit{value: SEND_VALUE}();
        uint256 amountDeposited = ledger.s_addressToAmountDeposited(USER);
        assertEq(amountDeposited, SEND_VALUE);
    }

    function test_DepositRevertsOnZeroValue() public {
        vm.prank(USER);
        vm.expectRevert(); 
        ledger.deposit{value: 0}();
    }
}