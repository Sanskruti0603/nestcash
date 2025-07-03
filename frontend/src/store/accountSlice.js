import { createSlice } from "@reduxjs/toolkit";

const getInitialSelectedAccountId = () => {
  try {
    return localStorage.getItem("selectedAccountId");
  } catch (err) {
    return null;
  }
};
const accountSlice = createSlice({
  name: "account",
  initialState: {
    selectedAccountId: getInitialSelectedAccountId(),
  },
  reducers: {
    setSelectedAccountId: (state, action) => {
      state.selectedAccountId = action.payload;
      localStorage.setItem("selectedAccountId", action.payload);
    },
  },
});

export const { setSelectedAccountId } = accountSlice.actions;
export default accountSlice;
