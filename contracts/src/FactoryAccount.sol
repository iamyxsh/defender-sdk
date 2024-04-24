// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { RelaySmartContract } from './SmartAccount.sol';
import { console2 } from 'forge-std/console2.sol';

contract FactoryAccount {
  function createAccount(address _owner) external returns (address) {
    bytes32 salt = bytes32(uint256(uint160(_owner)));
    bytes memory bytecode = abi.encodePacked(type(RelaySmartContract).creationCode, abi.encode(_owner));

    address addr = computeAddress(salt, keccak256(bytecode));

    if (addr.code.length > 0) {
      return addr;
    }

    address a = deploy(salt, bytecode);
    return a;
  }

  function deploy(bytes32 salt, bytes memory bytecode) internal returns (address addr) {
    /// @solidity memory-safe-assembly
    assembly {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
    }
  }

  function computeAddress(bytes32 salt, bytes32 bytecodeHash) public view returns (address addr) {
    address deployer = address(this);
    assembly {
      let ptr := mload(0x40)

      mstore(add(ptr, 0x40), bytecodeHash)
      mstore(add(ptr, 0x20), salt)
      mstore(ptr, deployer)
      let start := add(ptr, 0x0b)
      mstore8(start, 0xff)
      addr := and(keccak256(start, 85), 0xffffffffffffffffffffffffffffffffffffffff)
    }
  }
}
