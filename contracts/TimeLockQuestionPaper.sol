// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLockQuestionPaper {

    struct Paper {
        string cid;
        uint256 unlockTime;
        bool exists;
    }

    // string public name="hello";

    mapping(string => Paper) public papers;
    address public owner;

    event PaperStored(string indexed paperId, string cid, uint256 unlockTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function storePaper(string memory paperId, string memory cid, uint256 unlockTime) external onlyOwner {
        require(!papers[paperId].exists, "Paper already exists");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");

        papers[paperId] = Paper(cid, unlockTime, true);

        emit PaperStored(paperId, cid, unlockTime);
    }

    function getPaperCID(string memory paperId) external view returns (string memory) {
        require(papers[paperId].exists, "Paper not found");
        require(block.timestamp >= papers[paperId].unlockTime, "Paper still locked");

        return papers[paperId].cid;
    }

}