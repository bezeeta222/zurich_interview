// UsersList.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  setUsers,
  setCurrentPage,
  toggleShowEmail,
} from "../../store/reducer/userListSlice";
import { RootState } from "../../store";
import { Grid, IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const perPage = 4;

const UsersList: React.FC = () => {
  const users = useSelector((state: RootState) => state.userList.users);
  const currentPage = useSelector(
    (state: RootState) => state.userList.currentPage
  );
  const dispatch = useDispatch();

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        const filteredUsers = data.data.filter(
          (user: any) =>
            user.first_name.startsWith("G") || user.last_name.startsWith("W")
        );
        dispatch(setUsers(filteredUsers));
      } else {
        console.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const usersToDisplay = users.slice(startIndex, endIndex);

  const handleToggleEmails = (id: number) => {
    dispatch(toggleShowEmail({ userId: id }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {usersToDisplay.map((user: any) => (
          <Card key={user.id} sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.showEmail ? user.email : "Email is hidden"}
              </Typography>
            </CardContent>
            <CardActions>
              <Grid container justifyContent="center">
                <IconButton onClick={() => handleToggleEmails(user.id)}>
                  {user.showEmail ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Grid>
            </CardActions>
          </Card>
        ))}
      </div>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 10 }}>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={endIndex >= users.length}
          >
            Next
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 10 }}>
        <Typography variant="body2" align="center" color="textSecondary">
          Default it filter first name starting with “G”, or last name starting
          with “W”.
        </Typography>
      </Grid>
    </div>
  );
};

export default UsersList;
