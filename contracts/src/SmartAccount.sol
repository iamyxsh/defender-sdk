// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IAccount } from 'account-abstraction/interfaces/IAccount.sol';
import { IEntryPoint } from 'account-abstraction/interfaces/IEntrypoint.sol';
import { PackedUserOperation } from 'account-abstraction/interfaces/PackedUserOperation.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ECDSA } from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import { MessageHashUtils } from '@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol';

contract RelaySmartContract is IAccount, Ownable {
  using ECDSA for bytes32;
  using MessageHashUtils for bytes32;

  constructor(address _owner) Ownable(_owner) {}

  function validateUserOp(
    PackedUserOperation memory userOp,
    bytes32 userOpHash,
    uint256
  ) external view override returns (uint256) {
    address signer = ECDSA.recover(userOpHash.toEthSignedMessageHash(), userOp.signature);

    require(signer == owner(), 'not signed by the owner');
    return 0;
  }

  function execute(address to, bytes memory data) external {
    _call(to, 0, data);
  }

  function _call(address target, uint256 value, bytes memory data) internal {
    (bool success, bytes memory result) = target.call{ value: value }(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
  }
}
