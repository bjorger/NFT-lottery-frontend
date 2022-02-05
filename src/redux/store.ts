import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./features/userSlice";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false,
});
export const store = configureStore({
    reducer: {
        user: UserReducer,
    },
    middleware: customizedMiddleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
