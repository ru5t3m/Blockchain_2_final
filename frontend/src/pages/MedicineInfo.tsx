import { useState } from "react";
import { TextField, Button, Grid, Box, CircularProgress, Alert, Typography } from "@mui/material";

function MedicineInfo({ state }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<any | null>(null);

  const getMedicineInfo = async (e: any) => {
    e.preventDefault();
    const { contract } = state;
    const medicine_id = e.target.medicine_id.value;

    setLoading(true);
    setError(null);
    try {
      const info = await contract.getMedicineInfo(medicine_id);
      setLoading(false);
      setInfo({
        name: info[0],
        location: info[1],
        owner: info[2],
        batch_no: info.batch_no,
      });
    } catch (error) {
      setLoading(false);
      setError("Transaction failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <Box>
      <form onSubmit={getMedicineInfo}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="medicine_id" label="Medicine hash" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Search
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

      {info && (
        <Box my={4}>
          <Alert severity="success">
            <Typography>Medicine Info:</Typography>
            <Typography>Name: {info.name}</Typography>
            <Typography>Location: {info.location}</Typography>
            <Typography>Owner: {info.owner}</Typography>
            <Typography>Batch Number: {info.batch_no}</Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
}

export default MedicineInfo;
