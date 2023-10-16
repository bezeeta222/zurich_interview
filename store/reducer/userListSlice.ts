import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  showEmail: boolean;
}

interface UserListState {
  users: User[];
  currentPage: number;
}

const initialState: UserListState = {
  users: [],
  currentPage: 1,
};

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload.map((user) => ({
        ...user,
        showEmail: false,
      }));
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    toggleShowEmail: (state, action: PayloadAction<{ userId: number }>) => {
      // Find the user by ID and toggle their showEmail property.
      const userToToggle = state.users.find(
        (user) => user.id === action.payload.userId
      );
      if (userToToggle) {
        userToToggle.showEmail = !userToToggle.showEmail;
      }
    },
  },
});

export const { setUsers, setCurrentPage, toggleShowEmail } =
  userListSlice.actions;

export default userListSlice.reducer;
