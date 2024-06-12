import { useState } from "react";
import { TextField, Button, Grid, Box, CircularProgress, Alert, Typography } from "@mui/material";

function LocateMedicine({ state }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const locateMedicine = async (e: any) => {
    e.preventDefault();
    const { contract } = state;
    const medicine_id = e.target.medicine_id.value;

    setLoading(true);
    setError(null);
    try {
      const location = await contract.locateMedicine(medicine_id);
      setLoading(false);
      setLocation(location);
    } catch (error) {
      setLoading(false);
      setError("Transaction failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <Box>
      <form onSubmit={locateMedicine}>
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

      {location && (
        <Box my={4}>
          <Alert severity="success">
            <Typography>Location: {location}</Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
}

export default LocateMedicine;
