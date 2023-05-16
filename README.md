# Decentralised voting application

voting dapp created using solidity, hardhat and React.js
polygon mumbai was used as a testnet

## how to use

1. change .env.example to .env and add your PRIVATE_KEY
2. make sure the rpc url for polygon mumbai testnet is correct !
3. in your terminal run `yarn hardhat run scripts/deploy.js --network polygon_mumbai`
4. if the above steps are done correctly, then your terminal will give you a contract address
5. go to voting-dapp-react -> src -> Constant -> constant.js
6. change contract_address to the address you got from the run in step no. 4
7. now run `cd voting-dapp-react` on terminal to enter the file
8. use the command `yarn start` to start the react-app on local host
9. if done correctly, voting-dapp will start

## feedbacks and review are most welcomed !

here is a glimpse:
![Screenshot (3)](https://github.com/NamanMohnani/voting-dapp/assets/110343547/4f71b0be-8786-47a1-90b5-2da605382ea0)

