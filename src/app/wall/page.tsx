"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

const TipJarABI = [
  "event TipReceived(address indexed sender, uint256 amount, string note)",
  "function tip(string calldata note) external payable"
];

interface TipEntry {
  sender: string;
  amount: string;
  note: string;
  transactionHash: string;
}

export default function WallPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tips, setTips] = useState<TipEntry[]>([]);
  
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const initWeb3 = async () => {
        const _provider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(_provider);
        
        const network = await _provider.getNetwork();
        // Sepolia chainId is 11155111. Localhost is 1337 or 31337
        if (network.chainId !== 11155111n && network.chainId !== 31337n && network.chainId !== 1337n) {
          setWrongNetwork(true);
        } else {
          setWrongNetwork(false);
        }

        const _contract = new ethers.Contract(contractAddress, TipJarABI, _provider);
        setContract(_contract);
      };
      initWeb3();
    }
  }, []);

  // Fetch initial logs & listen to events
  useEffect(() => {
    if (!contract || !provider) return;

    const fetchLogs = async () => {
      try {
        const filter = contract.filters.TipReceived();
        const logs = await contract.queryFilter(filter, 0, "latest");
        
        const historicalTips = logs.map((log: any) => ({
          sender: log.args[0],
          amount: ethers.formatEther(log.args[1]),
          note: log.args[2],
          transactionHash: log.transactionHash
        })).reverse();
        
        setTips(historicalTips);
      } catch (e) {
        console.error("Error fetching logs:", e);
      }
    };
    
    fetchLogs();

    const listener = (sender: string, amt: bigint, noteText: string, event: any) => {
      setTips(prev => [
        {
          sender,
          amount: ethers.formatEther(amt),
          note: noteText,
          transactionHash: event.log.transactionHash
        },
        ...prev
      ]);
    };
    
    contract.on("TipReceived", listener);
    
    return () => {
      contract.off("TipReceived", listener);
    };
  }, [contract, provider]);

  const connectWallet = async () => {
    if (!provider) return alert("MetaMask not installed");
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (e: any) {
      console.error(e);
    }
  };

  const switchNetwork = async () => {
    if (!provider) return;
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }] // Sepolia
      });
      setWrongNetwork(false);
    } catch (e) {
      console.error("Error switching network:", e);
    }
  };

  const sendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setErrorMsg("");

    if (note.length > 256) {
      setErrorMsg("Note is too long (max 256 chars)");
      return;
    }

    if (!contract || !provider || !account) return;

    try {
      setStatus("Waiting for wallet approval...");
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer) as ethers.Contract;
      
      const tx = await contractWithSigner.tip(note, { value: ethers.parseEther(amount) });
      setStatus("Transaction sent! Waiting for confirmation...");
      
      const receipt = await tx.wait();
      
      // The receipt status is inspected after the transaction resolves
      if (receipt.status === 1) {
        setStatus("Tip sent successfully! Thank you!");
        setNote("");
      } else {
        // Reverted transaction branch
        setErrorMsg("Transaction failed or reverted by the network.");
        setStatus("");
      }
    } catch (error: any) {
      setStatus("");
      // A rejected wallet prompt has its own branch
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        setErrorMsg("You rejected the transaction in your wallet.");
      } else {
        setErrorMsg("An error occurred: " + (error.message || "Unknown error"));
      }
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Commuter Tip Wall</h1>
      <p>Send a small tip and leave a note. Your message is permanently recorded on the blockchain!</p>
      
      {!account ? (
        <button onClick={connectWallet} style={btnStyle}>Connect Wallet</button>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <p>Connected: {account}</p>
          {wrongNetwork && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              <p>You are on the wrong network! Please switch to Sepolia.</p>
              <button onClick={switchNetwork} style={btnStyle}>Switch to Sepolia</button>
            </div>
          )}
        </div>
      )}

      {account && !wrongNetwork && (
        <form onSubmit={sendTip} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <div>
            <label>Amount (ETH): </label>
            <input type="number" step="0.001" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div>
            <label>Note (max 256 chars): </label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} maxLength={256} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
          </div>
          <button type="submit" style={btnStyle}>Send Tip</button>
          
          {status && <div style={{ color: "blue", marginTop: "10px" }}>{status}</div>}
          {errorMsg && <div style={{ color: "red", marginTop: "10px" }}>{errorMsg}</div>}
        </form>
      )}

      <h2>Live Wall of Supporters</h2>
      <p><em>Populated directly from decoded blockchain event logs</em></p>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        {tips.length === 0 ? <p>No tips yet.</p> : tips.map((t, idx) => (
          <div key={t.transactionHash + idx} style={{ borderLeft: "4px solid #39ff14", paddingLeft: "15px", backgroundColor: "var(--bg-tertiary)", padding: "10px 10px 10px 20px" }}>
            <p><strong>{t.sender}</strong> tipped <strong>{t.amount} ETH</strong></p>
            <p>"{t.note}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#000",
  color: "#39ff14",
  border: "1px solid #39ff14",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "4px"
};
