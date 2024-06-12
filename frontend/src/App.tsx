import { useEffect, useState } from "react";
import abi from "./contractJson/medicine.json";
import { ethers } from "ethers";
import { AppBar, Toolbar, Typography, Container, CssBaseline, Button, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddMedicine from "./pages/AddMedicine";
import BuyMedicine from "./pages/BuyMedicine";
import MedicineInfo from "./pages/MedicineInfo";
import LocateMedicine from "./pages/LocateMedicine";

function App() {
  const [state, setState] = useState<any>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("");

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0x7960610A5Ed933ee21c4147C960f82F23dCDD873";
      const contractABI = abi.abi;

      const { ethereum } = window as any;

      if (typeof ethereum !== "undefined") {
        try {
          const acc = await ethereum.request({
            method: "eth_requestAccounts",
          });

          (window as any).ethereum.on("accountsChanged", function () {
            window.location.reload();
          });

          setAccount(acc[0]);

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);

          setState({
            provider,
            signer,
            contract,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please install MetaMask");
      }
    };
    template();
  }, []);

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Medicine Blockchain App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/add">
            Add Medicine
          </Button>
          <Button color="inherit" component={Link} to="/buy">
            Buy Medicine
          </Button>
          <Button color="inherit" component={Link} to="/info">
            Medicine Info
          </Button>
          <Button color="inherit" component={Link} to="/locate">
            Locate Medicine
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Connected account: {account}
          </Typography>
          <Routes>
            <Route path="/add" element={<AddMedicine state={state} />} />
            <Route path="/buy" element={<BuyMedicine state={state} />} />
            <Route path="/info" element={<MedicineInfo state={state} />} />
            <Route path="/locate" element={<LocateMedicine state={state} />} />
            <Route
              path="/"
              element={
                <Box>
                  <Typography variant="h4">Welcome to the Medicine Blockchain App</Typography>
                  <Typography variant="body1">
                    Use the navigation bar to add, buy, search, and locate medicines on the blockchain.
                  </Typography>
                </Box>
              }
            />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
