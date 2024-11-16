// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

contract ContextManagement {
    // Define the Transaction struct
    struct AiContext {
        address owner;
        string message;
        uint256 time;
    }

    // Define global variables
    uint256 public numberOfMessages = 0;

    address public contractOwner;

    // Mappings
    mapping(uint256 => AiContext) public aiContext;

    // Define events
    event NewMessage(address owner, string message);

    // Define the constructor
    constructor() {
        contractOwner = msg.sender;
    }

    function addNewMessage(
        address _owner,
        string memory _message
    ) public payable returns (uint256) {
        address newOwner = msg.sender;
        require(len(_message) > 0, "Message can't be empty");

        AiContext storage newContext = aiContext[numberOfMessages];
        newContext.owner = newOwner;
        newContext.message = _message;
        newContext.time = block.timestamp;
        numberOfMessages++;

        emit NewMessage(_owner, _message);

        return numberOfTickets - 1;
    }
}
