import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import HeaderAndDrawer from "./HeaderAndDrawer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { authUser, email } from "../Reducers/UserSlice";
import { useDispatch } from "react-redux";
import validator from "validator";
import { Alert } from "@mui/material";
//import { RootState } from "../../app/store";

// Most code from https://github.com/mui/material-ui/blob/v5.14.17/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

const AUTH_USER_MUTATION = gql`
  mutation authUser($email: String!, $password: String!) {
    authUser(email: $email, password: $password) {
      success
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation userCreate($email: String!, $password: String!) {
    userCreate(email: $email, password: $password) {
      userModel {
        email
        password
      }
    }
  }
`;

/*
React component for handling user authentication and login.
 */
export default function LoginPage() {
  // Hooks for navigation, state management, and form input
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validPassword, setValidPassword] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showAlertMessage, setShowAlertMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  // GraphQL mutations and form state
  const [authUserMutation] = useMutation(AUTH_USER_MUTATION);
  const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
  const [emailString, setEmail] = useState<string>("");
  const [passwordString, setPassword] = useState<string>("");
  const [signup, setSignup] = useState<boolean>(false);

  // Function to display alerts
  const showAlert = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setShowSuccessAlert(true);
    setShowAlertMessage(message);
    setSeverity(severity);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  // Event handlers for form input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Function to handle user sign-in
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("signin");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);

    if (emailString != undefined && passwordString != undefined) {
      // Check if email is an actual email
      if (!validator.isEmail(emailString)) {
        showAlert("Email not valid", "error");
        setSignup(false);
        return;
      }
      // Check if password is long enough
      if (passwordString.length < 8) {
        setValidPassword(false);
        showAlert("Password to short", "error");
        setSignup(false);
        return;
      }
      try {
        setValidPassword(true);
        // Checks if user exists and if password is correct
        const { data } = await authUserMutation({
          variables: { email: emailString, password: passwordString },
        });
        //logs in user if password is correct and user exists
        if (data.authUser.success && emailString != null) {
          dispatch(authUser(true));
          dispatch(email(emailString));
          showAlert("Successfully logged in", "success");
          navigate("/");
        } else {
          // Password is wrong
          // If user is trying to sign up, but email is valid, user is informed.
          signup
            ? showAlert("User already exists, but wrong password.", "error")
            : showAlert("Wrong password", "error");
        }
        setSignup(false);
      } catch (error) {
        // Other issues have occured
        console.error("Auth failed", error);
      }
    }
  };

  // Function to handle user sign-up
  const handleSignUp = async () => {
    setSignup(true);
    try {
      // Tries to create a new user with the given email and password
      const { data } = await createUserMutation({
        variables: { email: emailString, password: passwordString },
      });
      // If valid, user is created and logged in
      if (
        data.userCreate.userModel.email &&
        data.userCreate.userModel.password
      ) {
        dispatch(authUser(true));
        dispatch(email(emailString));
        navigate("/");
      } else {
        showAlert("Unable to create user.", "error");
      }
    } catch (error) {
      if (
        // Tried to sign up with already existing email and correct password. Logs in user.
        error instanceof ApolloError &&
        error.message.includes("E11000 duplicate key error")
      ) {
        showAlert("User already exists. Successfully logged in", "success");
      } else {
        showAlert("Unable to create user. Try again.", "error");
        console.error("UserCreate failed", error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <HeaderAndDrawer />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "white" }}>
          <img
            width={30}
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
          />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleEmailChange}
            autoFocus
          />
          {!validPassword && <p>Password is too short</p>}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <></>
          <p>Not already a user?</p>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Box>
        {showSuccessAlert && (
          <div
            style={{
              position: "absolute",
              bottom: 50,
              left: 40,
              right: 40,
              zIndex: 9999,
              border: "1px solid #000",
              borderRadius: 4,
            }}
          >
            <Alert
              severity={severity}
              onClose={() => setShowSuccessAlert(false)}
            >
              {showAlertMessage}
            </Alert>
          </div>
        )}
      </Box>
    </Container>
  );
}
