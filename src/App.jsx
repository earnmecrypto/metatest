import './App.css';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';

function App() {
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [errorMessege, setErrorMessege] = useState('');
  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(null);
  const [buttonConnect, setButtonConnect] = useState('Connect Wallet');

  const { ethereum } = window

  const getWallet = async () => {
    if (ethereum) {
      ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          setAccountAddress(result[0])
          getAccountBalance(result[0])
          setButtonConnect('Wallet Connected');
        }).catch(error => {
          setErrorMessege(error.message);
        })
    } else {
      window.open('https://bit.ly/35swGNT', '_blank');
    }
  }

  const getAccountBalance = (address) => {
    ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then(balance => {
        setAccountBalance(ethers.utils.formatEther(balance))
      })
  }

  const sendEthButton = async () => {
    if (!accountAddress) { return getWallet() }
    ethereum.request({
      method: `eth_sendTransaction`,
      params: [{
        nonce: '0x00',
        gasPrice: ethers.utils.parseEther("0.0000006")._hex,
        gas: '0x2710',
        to: sendAddress,
        from: accountAddress,
        value: ethers.utils.parseEther(sendAmount)._hex,
        data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        chainId: '0x3'
      }]
    }).then((txHash) => console.log(txHash))
      .catch((error) => setErrorMessege(error.message.split(':')[1]));
  }
  const isSafari = window.safari !== undefined;
  if (!isSafari) {
    ethereum.on('accountsChanged', getWallet);
    ethereum.on('chainChanged', window.location.reload);
  }

  useEffect(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, []);


  return (
    <div className="App">
      <h1>{errorMessege}</h1>
      <h1>Connect Wallet</h1>
      <button onClick={() => { getWallet() }}>{buttonConnect}</button>
      <h1>Address: {accountAddress}</h1>
      <h1>Ammount: {accountBalance}</h1>

      <div className="Info">
        <input type="text" placeholder='Address' onChange={(e) => setSendAddress(e.target.value)} />
        <input type="text" placeholder='Amount' onChange={(e) => setSendAmount(e.target.value)} />
        <button onClick={() => sendEthButton()}>Send</button>
      </div>
    </div>
  );
}

export default App;



// const [updateFunction, setUpdateFunction] = useState(false);
//
  // useEffect(() => {
  //   if (ethereum.selectedAddress) {
  //     getWallet()
  //   }
  //   setTimeout(() => { return setUpdateFunction(true) }, 1000);
  // }, [updateFunction]);