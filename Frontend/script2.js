import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.js";

console.log("1. Script loaded and Ethers library imported!");

const contractAddress = "0x15bCfcdB7CA79edE53Cf69dD2E6E8274C3338E1E"; 
const abi = [
    "function deposit() public payable",
    "function s_addressToAmountDeposited(address) public view returns (uint256)",
    "function getContractBalance() public view returns (uint256)"
];

let provider;
let signer;

async function connect() {
    console.log("3. Connect button actually clicked!");
    if (window.ethereum) {
        try {
            console.log("4. MetaMask detected, requesting accounts...");
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner();
            const address = await signer.getAddress();
            document.getElementById("connection-status").innerText = "Connected: " + address;
            console.log("5. Success! Connected to:", address);
        } catch (error) {
            console.error("6. Error during connection:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

window.onload = () => {
    console.log("2. Page is fully loaded, linking buttons now...");
    
    const connectBtn = document.getElementById("connectBtn");
    if(connectBtn) {
        connectBtn.onclick = connect;
        console.log("Connect button linked!");
    } else {
        console.error("COULD NOT FIND connectBtn in HTML!");
    }

    document.getElementById("depositBtn").onclick = deposit;
    document.getElementById("checkBalanceBtn").onclick = updateBalances;
};


async function deposit() {
    const amount = document.getElementById("depositAmount").value;
    if (!amount || !signer) return alert("Connect wallet & enter amount!");
    try {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.deposit({ 
    value: ethers.parseEther(amount),
    gasLimit: 100000 
});
        await tx.wait(); 
        
        updateBalances();
    } catch (error) { console.error(error); }
}

async function updateBalances() {
    if (!signer) return;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const address = await signer.getAddress();
    const userDeposit = await contract.s_addressToAmountDeposited(address);
    document.getElementById("userBalance").innerText = ethers.formatEther(userDeposit);
}