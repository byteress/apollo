import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { BookingPayload, BookingState } from '../types';
import { submitBooking } from '../services/api';

export const submitBookingAsync = createAsyncThunk(
  'booking/submit',
  async (payload: BookingPayload, { rejectWithValue }) => {
    try {
      const response = await submitBooking(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit booking');
    }
  }
);

const initialState: BookingState = {
  status: 'idle',
  error: null,
  appointments: [
    {
      id: 'mock-1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-0100',
      vehicleInfo: '2020 Ford Mustang',
      serviceRequired: 'headlights',
      locationPreference: 'in-shop',
      specificRequests: 'Want RGB halos and demon eyes.',
      status: 'pending',
      date: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      phone: '555-0200',
      vehicleInfo: '2018 Toyota Tacoma',
      serviceRequired: 'headunit',
      locationPreference: 'mail-in',
      specificRequests: 'Need wireless CarPlay.',
      status: 'approved',
      date: new Date(Date.now() - 86400000).toISOString(),
    }
  ],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: 'approved' | 'rejected' }>) => {
      const appointment = state.appointments.find(a => a.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBookingAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBookingAsync.fulfilled, (state, action) => {
        state.status = 'success';
        state.appointments.unshift(action.payload);
      })
      .addCase(submitBookingAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const { resetBookingState, updateAppointmentStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
