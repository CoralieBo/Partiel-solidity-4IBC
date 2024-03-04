import './App.css';
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import SideNav from './components/navbar';
import contractAbi from "./contractAbi.json";
import Inscription from './components/inscription';
import Matches from './components/matches';
import Bets from './components/bets';

const provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = "0x0d4007ccB640e047C7107cA65dCB1CC42E0214ED";

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [pageSelected, setPageSelected] = useState(0);

  const [contractSigner, setContractSigner] = useState(null);
  const [contractProvider, setContractProvider] = useState(null);

  useEffect(() => {
    const contractP = new ethers.Contract(contractAddress, contractAbi, provider);
    setContractProvider(contractP);
  }, []);

  const connectwalletHandler = async () => {
    if (window.ethereum) {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner()

      const contractS = new ethers.Contract(contractAddress, contractAbi, signer);
      setContractSigner(contractS);

      const contractP = new ethers.Contract(contractAddress, contractAbi, provider);
      const user = (await contractP.getUser(await signer.getAddress()))
      if (user[1] === '') {
        setIsOpen(true);
      } else {
        setDefaultAccount(signer);
        setUser(user);
        setIsOpen(false);
      }
    }
  }

  return (
    <div className="bg-slate-900 text-slate-100 flex h-screen">
      <SideNav defaultAccount={defaultAccount} connectwalletHandler={connectwalletHandler} user={user} selected={pageSelected} setSelected={setPageSelected} />
      <div className="w-full">
        <div className="h-[35px] m-4">
          { pageSelected === 0 && <p className="text-center text-2xl font-bold">All matches</p> }
          { pageSelected === 1 && <p className="text-center text-2xl font-bold">Your bets</p> }
        </div>
        { pageSelected === 0 && <Matches contractProvider={contractProvider} contractSigner={contractSigner} connectwalletHandler={connectwalletHandler} /> }
        { pageSelected === 1 && <Bets account={defaultAccount} connectwalletHandler={connectwalletHandler} /> }
      </div>
      <Inscription contractSigner={contractSigner} isOpen={isOpen} setIsOpen={setIsOpen} connectwalletHandler={connectwalletHandler} />
    </div>
  );
}

export default App;
