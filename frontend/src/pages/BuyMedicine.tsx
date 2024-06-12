import { useState } from "react";
import { TextField, Button, Grid, Box, CircularProgress, Alert } from "@mui/material";
import { ethers } from "ethers";

function BuyMedicine({ state }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buyMedicine = async (e: any) => {
    setSuccessMessage(null);
    setError(null);
    e.preventDefault();
    const { contract } = state;

    const amount = {
      value: ethers.parseEther(e.target.amount.value),
    };

    setLoading(true);
    try {
      const tx = await contract.buyMedicine(
        e.target.medicine_id.value,
        e.target.new_owner.value,
        e.target.new_location.value,
        amount
      );
      await tx.wait();
      setSuccessMessage("Transaction successful");
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={buyMedicine}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="medicine_id" label="Medicine hash" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="new_owner" label="New owner" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="new_location" label="New location" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="amount" label="Amount" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Buy
            </Button>
          </Grid>
        </Grid>
      </form>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {successMessage && (
        <Box my={4}>
          <Alert severity="success">{successMessage}</Alert>
        </Box>
      )}
    </Box>
  );
}

export default BuyMedicine;
