"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsers,
  setCurrentPage,
  setIsLoading,
  toggleShowEmail,
  selectUsers,
  selectCurrentPage,
  setTotalPage,
} from "../../store/reducer/userListSlice";
import { clearSession } from "../../store/reducer/session";
import { RootState } from "../../store";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { redirect } from "next/navigation";

const UsersList: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const currentPage = useSelector(selectCurrentPage);
  const perPages = useSelector((state: RootState) => state.userList.per_page);
  const isLoading = useSelector((state: RootState) => state.userList.isLoading);
  const status = useSelector((state: RootState) => state.userSession); // Access the session status from the Redux store
  const total_pages = useSelector(
    (state: RootState) => state.userList.total_pages,
  );

  useEffect(() => {
    fetchAllUsers(currentPage);
  }, [currentPage]);

  const fetchAllUsers = async (page: number) => {
    dispatch(setIsLoading(true));

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          page,
          per_page: perPages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const filteredData = data.data.filter((user: any) => {
          const firstName = user.first_name || "";
          const lastName = user.last_name || "";
          return firstName.startsWith("G") || lastName.startsWith("W");
        });

        dispatch(setUsers(filteredData));
        dispatch(setTotalPage(data.total_pages));
      } else {
        console.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleToggleEmails = (id: number) => {
    dispatch(toggleShowEmail({ userId: id }));
  };
  const onPrevious = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const onNext = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  if (status === "loading") {
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>;
  }

  if (status === "unauthenticated" || status === undefined || status === null) {
    dispatch(clearSession());
    redirect("/");
    return <p>Access Denied</p>;
  }

  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user: any) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card sx={{ maxHeightheight: 200 }}>
              <CardMedia
                component="img"
                height="140"
                width="140"
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
                    {user.showEmail ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </div>{" "}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 10 }}>
        {currentPage > 1 && (
          <Grid item>
            <Button variant="text" onClick={onPrevious}>
              Previous
            </Button>
          </Grid>
        )}

        {currentPage + 1 <= total_pages && (
          <Grid item>
            <Button variant="text" onClick={onNext}>
              Next
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 10 }}>
        <Typography variant="body2" align="center" color="textSecondary">
          By Default it filter first name starting with “G”, or last name
          starting with “W”.
        </Typography>
      </Grid>
    </div>
  );
};

export default UsersList;
