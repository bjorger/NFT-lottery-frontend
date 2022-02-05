import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Moralis from "moralis";
import { RootState } from "../store";

interface UserState {
    user: Moralis.User<Moralis.Attributes> | undefined;
}

const initialState: UserState = {
    user: undefined,
};

export const userSlice = createSlice({
    name: "user",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        handleUser: (
            state,
            action: PayloadAction<Moralis.User<Moralis.Attributes> | undefined>
        ) => {
            state.user = action.payload;
        },
    },
});

export const { handleUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
