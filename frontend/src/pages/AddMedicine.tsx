import { useState } from "react";
import { TextField, Button, Grid, Box, CircularProgress, Alert } from "@mui/material";

function AddMedicine({ state }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [qrData, setQRData] = useState<string | null>(null);

  const addMedicine = async (e: any) => {
    setSuccessMessage(null);
    setError(null);
    e.preventDefault();

    const { contract } = state;

    const medicine = {
      name: `${e.target.name.value}, expires on ${e.target.expiry_date.value}`,
      location: e.target.location.value,
      owner: e.target.owner.value,
      batch_no: e.target.batch_no.value,
    };

    setLoading(true);
    try {
      const txResponse = await contract.addMedicine(
        medicine.name,
        medicine.location,
        medicine.owner,
        medicine.batch_no
      );
      await txResponse.wait();

      const receipt = await state.provider.getTransactionReceipt(txResponse.hash);

      const event = contract.interface.parseLog(receipt.logs[0]);

      setSuccessMessage("Transaction successful: " + JSON.stringify(event.args[0]));

      // Формирование URL с данными транзакции для QR-кода
      const transactionData = JSON.stringify(event.args[0]);
      const transactionUrl = `https://sepolia.etherscan.io/tx/${txResponse.hash}`;
      const qrData = `${transactionData} ${transactionUrl}`;
      setQRData(qrData);
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={addMedicine}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="name" label="Name" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="expiry_date" label="Expiry Date" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="owner" label="Owner" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="location" label="Location" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="batch_no" label="Batch Number" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Add
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
          {qrData && (
            <Box mt={2} textAlign="center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`} alt="QR Code" />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default AddMedicine;
