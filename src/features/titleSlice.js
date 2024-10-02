import { createSlice } from '@reduxjs/toolkit';

const titleSlice = createSlice({
    name: 'title',
    initialState: {
        currentTitle: 'Historial Psicólogico', 
    },
    reducers: {
        setTitle: (state, action) => {
            state.currentTitle = action.payload;
        },
    },
});

export const { setTitle } = titleSlice.actions;
export default titleSlice.reducer;
