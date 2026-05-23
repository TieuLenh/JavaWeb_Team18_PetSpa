export const slotMock = {
  success: true,
  message: "Get available slots successfully",
  data: [
    // Ca sáng: 08:00 - 11:00
    { start_time: "08:00", end_time: "08:30", available: true },
    { start_time: "08:30", end_time: "09:00", available: true },
    
    { start_time: "09:00", end_time: "09:30", available: false, reason: "BOOKED" },
    { start_time: "09:30", end_time: "10:00", available: false, reason: "BOOKED" },
    
    { start_time: "10:00", end_time: "10:30", available: true },
    { start_time: "10:30", end_time: "11:00", available: true },
    
    // Nghỉ trưa: 11:00 - 13:00
    { start_time: "11:00", end_time: "11:30", available: false, reason: "OUTSIDE_WORKING_HOURS" },
    { start_time: "11:30", end_time: "12:00", available: false, reason: "OUTSIDE_WORKING_HOURS" },
    { start_time: "12:00", end_time: "12:30", available: false, reason: "OUTSIDE_WORKING_HOURS" },
    { start_time: "12:30", end_time: "13:00", available: false, reason: "OUTSIDE_WORKING_HOURS" },
    
    // Ca chiều: 13:00 - 17:00
    { start_time: "13:00", end_time: "13:30", available: false, reason: "GROOMER_BUSY" },
    { start_time: "13:30", end_time: "14:00", available: false, reason: "GROOMER_BUSY" },
    
    { start_time: "14:00", end_time: "14:30", available: true },
    { start_time: "14:30", end_time: "15:00", available: true },
    
    { start_time: "15:00", end_time: "15:30", available: true },
    { start_time: "15:30", end_time: "16:00", available: true },
    
    { start_time: "16:00", end_time: "16:30", available: true },
    { start_time: "16:30", end_time: "17:00", available: true },
  ],
};