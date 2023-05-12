import { useState, useEffect } from "react"
import { ethers } from "ethers"

import "./App.css"
import { contract_abi, contract_address } from "./Constant/constant"
import Login from "./Components/Login"
import Connected from "./Components/Connected"
import Finished from "./Components/Finished"

// cd voting-dapp-react to use yarn command for react-app

export function App() {
    const [provider, setProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [votingStatus, setVotingStatus] = useState(true)
    const [remainingTime, setRemainingTime] = useState("")
    const [candidates, setCandidates] = useState([])
    const [number, setNumber] = useState(0)
    const [canVote, setCanVote] = useState(true)

    useEffect(() => {
        get_candidates()
        get_remaining_time()
        get_current_status()

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handle_accounts_changed)
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handle_accounts_changed)
            }
        }
    })

    async function vote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract_instance = new ethers.Contract(contract_address, contract_abi, signer)

        const tx = await contract_instance.vote(number - 1)
        await tx.wait()
        can_vote()
    }

    async function can_vote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract_instance = new ethers.Contract(contract_address, contract_abi, signer)
        const vote_status = await contract_instance.voters(await signer.getAddress())
        setCanVote(vote_status)
    }

    async function get_current_status() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract_instance = new ethers.Contract(contract_address, contract_abi, signer)
        const status = await contract_instance.get_voting_status()
        console.log(status)
        setVotingStatus(status)
    }

    async function get_remaining_time() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract_instance = new ethers.Contract(contract_address, contract_abi, signer)
        const time = await contract_instance.get_remaining_time()
        setRemainingTime(parseInt(time, 16))
    }

    function handle_accounts_changed(accounts) {
        if (accounts.length > 0 && account !== accounts[0]) {
            setAccount(accounts[0])
            can_vote()
        } else {
            setIsConnected(false)
            setAccount(null)
        }
    }

    async function get_candidates() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract_instance = new ethers.Contract(contract_address, contract_abi, signer)
        const candidates = await contract_instance.get_all_candidates() // array
        const formatted_candidates = candidates.map((candidate, index) => {
            return {
                index: index,
                name: candidate.name,
                vote_count: candidate.vote_count.toNumber(),
            }
        })
        setCandidates(formatted_candidates)
    }

    async function connect_to_metamask() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                setProvider(provider)
                await provider.send("eth_requestAccounts", [])
                const signer = provider.getSigner()
                const address = await signer.getAddress()
                // const balance = await signer.getBalance()

                setAccount(address)
                console.log("metamask connected: " + address)
                setIsConnected(true)
                can_vote()
            } catch (error) {
                console.error(error)
            }
        } else {
            console.log("metamask is not detected in the browser !")
        }
    }

    async function handleNumberChange(e) {
        setNumber(e.target.value)
    }

    return (
        <div className="App">
            {votingStatus ? (
                isConnected ? (
                    <Connected
                        account={account}
                        candidates={candidates}
                        remainingTime={remainingTime}
                        number={number}
                        handleNumberChange={handleNumberChange}
                        vote_function={vote}
                        showButton={canVote}
                    />
                ) : (
                    <Login connectWallet={connect_to_metamask} />
                )
            ) : (
                <p></p>
            )}
        </div>
    )
}

export default App
