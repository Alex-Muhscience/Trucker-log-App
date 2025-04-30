import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';

const RouteForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    carrierName: '',
    officeAddress: '',
    truckNumber: '',
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    currentCycleUsed: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Typography variant="h5" gutterBottom>
        Trip Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Carrier Name"
              name="carrierName"
              value={formData.carrierName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Main Office Address"
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleChange}
              required
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Truck/Tractor Number"
              name="truckNumber"
              value={formData.truckNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Cycle Used (hours)"
              name="currentCycleUsed"
              type="number"
              value={formData.currentCycleUsed}
              onChange={handleChange}
              required
              inputProps={{ min: 0, max: 70, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Current Location"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Pickup Location"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Dropoff Location"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Plan Trip
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RouteForm;