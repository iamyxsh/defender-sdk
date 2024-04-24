// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IPaymaster } from 'account-abstraction/interfaces/IPaymaster.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { PackedUserOperation } from 'account-abstraction/interfaces/PackedUserOperation.sol';
import { ECDSA } from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import { MessageHashUtils } from '@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol';

contract Paymaster is IPaymaster, Ownable {
  using ECDSA for bytes32;
  using MessageHashUtils for bytes32;

  constructor(address _owner) Ownable(_owner) {}

  function validatePaymasterUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash,
    uint256
  ) external view override returns (bytes memory context, uint256 validationData) {
    address signer = ECDSA.recover(userOpHash.toEthSignedMessageHash(), userOp.signature);

    require(signer == owner(), 'not signed by the owner');
    context = new bytes(0);
    validationData = 0;
  }

  function postOp(PostOpMode, bytes calldata, uint256, uint256) external override {}

  receive() external payable {}
}
