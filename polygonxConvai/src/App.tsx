import styled from 'styled-components'
import './App.css'
import { GalaLogo, PolyLogo } from './assets'
import { Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import { BrowserProvider, ethers} from 'ethers'
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'

import PolyGonContractABI from "./contract/Polygon/polygonABI.json"
import { Route, Routes, useNavigate } from 'react-router-dom'
import Chatpage from './chat.page'
import abi from "./contract/Polygon/polygonABI.json"

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  min-width: 1200px;
`
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 30px;
  img {
    height: 50px;
  }
`

const CreatePlatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`
function App() {

  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const [address, setAddress] = useState('');
  const { walletProvider } = useWeb3ModalProvider();
  const [responseData, setResponseData] = useState('');

  const [character, setCharacter] = useState({} as any);
  // const { open } = useWeb3Modal()
  // const { address, isConnected } = useWeb3ModalAccount();

  const generateBackstory = async (inputText: string, characterName: string) => {
    setResponseData(""); // Clear previous response

    const url = "https://api.convai.com/character/generate-backstory";
    // const apiKey = "<Your-API-Key>";
    const headers = {
      "CONVAI-API-KEY": import.meta.env.VITE_CONVAI_API_KEY,
      Accept: "text/event-stream",
    };

    const formData = new URLSearchParams();
    formData.append("inputText", inputText);
    formData.append("charName", characterName);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.body) {
        throw new Error("No response body from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setResponseData((prev) => prev + chunk); // Update state with the new chunk
      }

      return fullResponse;

    } catch (error) {
      console.error("Error generating backstory:", error);
      return error;
    }
  };

  const getCharacter = async (charID: string) => {
    const url = "https://api.convai.com/character/get";
    const apiKey = ""; // Replace with your actual API key
  
    const headers = {
      "CONVAI-API-KEY": import.meta.env.VITE_CONVAI_API_KEY,
      "Content-Type": "application/json",
    };
  
    const requestBody = {
      charID: charID,
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Character data:", data);
      setCharacter(data)
      return data;
    } catch (error) {
      console.error("Error fetching character:", error);
      return null;
    }
  };
  

  const openConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const userAddress = accounts[0];
        console.log("Connected wallet address:", userAddress);
        // Save wallet address in local storage for persistence
        localStorage.setItem("walletAddress", userAddress);
        setAddress(userAddress);
        return userAddress;
      } catch (error) {
        console.error("User rejected the request or something went wrong:", error);
      }
    } else {
      console.error("MetaMask is not installed. Please install MetaMask and try again.");
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  // Function to logout
  const logoutWallet = () => {
    try {
      // Clear wallet address from local storage
      localStorage.removeItem("walletAddress");
      console.log("Wallet disconnected.");
      setAddress('')
      alert("Wallet has been disconnected.");
    } catch (error) {
      console.error("An error occurred during wallet logout:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if(prompt.trim().length === 0) {
      alert("Please type your prompt")
      return;
    }
    
    const desc = prompt.trim()
    const characterName = "G K Raghav"
    try {
      // Call generateBackstory to get the response
      const response = await generateBackstory(desc, characterName);
  
      // Ensure the response is valid
      if (!response || typeof response !== "string") {
        alert("Failed to generate backstory");
        return;
      }
  
      // Contract interaction
      const contractAddress = "0x837cBe8d21e3760477dc33813fE9552071e14FD7"; // Replace with your contract address
  
      // Connect to Ethereum provider (e.g., MetaMask)
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
  
      // Instantiate the contract
      const contract = new ethers.Contract(contractAddress, abi, signer);
  
      // Call the contract method
      const tx = await contract.addNewMessage(
        signer.getAddress(), // Owner address
        responseData,            // Generated backstory
        { gasLimit: 100000 }
      );
  
      // Wait for the transaction to be mined
      await tx.wait();
      console.log("Message stored on-chain:", tx);
      alert("Message successfully stored on-chain!");
  
    } catch (error) {
      console.error("Error submitting the message to the blockchain:", error);
      alert("Failed to store message on-chain.");
    }
  }

  useEffect(() => {
    getCharacter("02910810-9249-11ef-800e-42010a7be011")
  }, [])

  return (
    <>
    <Routes>
      <Route path="/" element={
        <>

        <AppContainer>
        <LogoWrapper>
          <img src={PolyLogo} />
        </LogoWrapper>
        
        {
          address.length === 0 &&
          <>
            <Button sx={{
              fontFamily: 'Roboto Mono',
              background: '#000000',
              color: '#FFFFFF',
              height: '50px',
              borderRadius: '10px'
            }}
            onClick={() => openConnect()}
            >
              CONNECT WALLET
            </Button>
          </>
        }

        {
          address.length != 0 &&
          <>
            <Button sx={{
              fontFamily: 'Roboto Mono',
              background: '#000000',
              color: '#FFFFFF',
              height: '50px',
              borderRadius: '10px'
            }}
            onClick={() => logoutWallet()}
            >
              ADDRESS: ${address}
            </Button>
          </>
        }

        <CreatePlatContainer>
          <p>
            Create your plot
          </p>

          <TextField type='text' id='text-field' placeholder='prompt' sx={{fontFamily: 'Roboto Mono, Inter'}}
            onChange={(e: any) => setPrompt(e.target.value)}
          />
          <Button
            sx={{
              fontFamily: 'Roboto Mono',
              background: '#000000',
              color: '#FFFFFF',
              height: '50px',
              borderRadius: '10px'
            }}
            onClick={handleSubmit}
          >
            CREATE PLOT
          </Button>

          {responseData}

          <p>
            <p>TALK TO YOUR CHARACTERS</p>
            <div style={{background: '#EEEEEE', padding: '10px', borderRadius: '5px'}} onClick={() => navigate(`../chat/${character.character_id}`)}>
              {character.character_name}
            </div>
          </p>
        </CreatePlatContainer>

      </AppContainer>
 
      </>
      }
      />

      <Route path="/chat/:id" element={<Chatpage />} />
    </Routes>
      
    </>
  )
}

export default App
