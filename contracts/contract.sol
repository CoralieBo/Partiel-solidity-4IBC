// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Pronostics {

    address public owner;
    uint256 public betPrice;

    struct User{
        uint id;
        string username;
        uint256 refund;
    }

    struct Match{
        uint id;
        uint date;
        string team1;
        string team2;
        bool finished;
        uint betsAmount;
    }

    struct Scores{
        uint score1;
        uint score2;
    }

    mapping (address=>User) private users;
    address[] private usersAddresses;

    Match[] private matches;
    mapping (uint=>Scores) private results; // matchId => Result
    mapping (uint=>mapping(address=>Scores)) private bets; // matchId => userAddress => Bet
    mapping (uint=>address[]) private betters; // matchId => users who bet on this match

    constructor(uint256 _betPrice){
        owner = msg.sender;
        betPrice = _betPrice;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyUser(){
        require(bytes(users[msg.sender].username).length > 0);
        _;
    }


    ///// ADMIN FUNCTIONS /////

    function setBetPrice(uint256 _betPrice) external onlyOwner {
        betPrice = _betPrice;
    }

    function addMatch(uint _date, string memory _team1, string memory _team2) external onlyOwner {
        matches.push(Match(matches.length, _date, _team1, _team2, false, 0));
    }

    function closeMatch(uint _matchId, uint _score1, uint _score2) external onlyOwner {
        require(matches[_matchId].date < block.timestamp, "Match not started yet");
        require(matches[_matchId].finished == false, "Match already finished");
        results[_matchId] = Scores(_score1, _score2);
        matches[_matchId].finished = true;
        uint length = betters[_matchId].length;
        address[] memory winners;
        uint winnersLength;
        for(uint i = 0; i < length; i++){
            if(bets[_matchId][betters[_matchId][i]].score1 == _score1 && bets[_matchId][betters[_matchId][i]].score2 == _score2){
                winners[winnersLength] = betters[_matchId][i];
                winnersLength++;
            }
        }
        if(winnersLength > 5){
            for(uint i = 0; i < 5; i++){
                uint random = uint (keccak256(abi.encodePacked (msg.sender, block.timestamp, i))) % winnersLength;
                users[winners[random]].refund += matches[_matchId].betsAmount / 5; // Attention ici il se peut que le user soit tiré plusieurs fois
            }
        }
        else{
            for(uint i = 0; i < winnersLength; i++){
                users[winners[i]].refund += matches[_matchId].betsAmount / winnersLength;
            }
        }
    }

    ///// USERS FUNCTIONS /////

    function inscription(string memory _username) external {
        require(bytes(_username).length > 0, "Username can't be empty");
        users[msg.sender] = User(usersAddresses.length, _username, 0);
    }

    function bet(uint _matchId, uint _score1, uint _score2) external onlyUser payable {
        require(msg.value == betPrice, "You must pay the bet price");
        require(matches[_matchId].date > block.timestamp, "Match already started");
        require(matches[_matchId].finished == false, "Match already finished");
        require(bets[_matchId][msg.sender].score1 == 0 && bets[_matchId][msg.sender].score2 == 0, "You already bet on this match");
        bets[_matchId][msg.sender] = Scores(_score1, _score2);
        betters[_matchId].push(msg.sender);
        matches[_matchId].betsAmount += betPrice;
    }

    function withdrawRefund() external onlyUser {
        uint refund = users[msg.sender].refund;
        require(refund > 0, "You have no refund to withdraw");
        users[msg.sender].refund = 0;
        (bool success, ) = msg.sender.call{value: refund}("");
        require(success);
    }

    ///// GETTERS /////

    function getMatches() external view returns(Match[] memory){
        return matches;
    }

    function getMatch(uint _matchId) external view returns(Match memory){
        return matches[_matchId];
    }

    function getResults(uint _matchId) external view returns(Scores memory){
        require(matches[_matchId].finished == true, "Match not finished yet");
        return results[_matchId];
    }

    function getBets(uint _matchId) external view returns(Scores[] memory){
        Scores[] memory betList = new Scores[](betters[_matchId].length);
        for(uint i = 0; i < betters[_matchId].length; i++){
            betList[i] = bets[_matchId][betters[_matchId][i]];
        }
        return betList;
    }

    function getUser(address _userAddress) external view returns(User memory){
        return users[_userAddress];
    }
}