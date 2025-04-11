// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLockQuestionPaper {
    struct Paper {
        string cid;
        uint256 unlockTime;
        bool exists;
    }

    mapping(string => Paper) public papers;
    mapping(string => mapping(string => string)) public studentResponse;
    address public owner;

    event PaperStored(string indexed paperId, string cid, uint256 unlockTime);
    event responseStored(
        string indexed paperId,
        string cid,
        string indexed studentId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function storePaper(
        string memory paperId,
        string memory cid,
        uint256 unlockTime
    ) external onlyOwner {
        require(!papers[paperId].exists, "Paper already exists");
        require(
            unlockTime >= block.timestamp,
            "Unlock time must be in the future"
        );

        papers[paperId] = Paper(cid, unlockTime, true);

        emit PaperStored(paperId, cid, unlockTime);
    }

    function getPaperCID(
        string memory paperId,
        uint256 chainTime
    ) external view returns (string memory) {
        require(papers[paperId].exists, "Paper not found");
        require(chainTime >= papers[paperId].unlockTime, "Paper still locked");

        return papers[paperId].cid;
    }

    function paperExists(string memory paperId) external view returns (bool) {
        return papers[paperId].exists;
    }

    function storeStudentResponse(
        string memory paperId,
        string memory cid,
        string memory studentId
    ) external {
        studentResponse[paperId][studentId] = cid;

        emit responseStored(paperId, cid, studentId);
    }

    function getStudentResponseCID(
        string memory paperId,
        string memory studentId
    ) external view returns (string memory) {
        return studentResponse[paperId][studentId];
    }
}