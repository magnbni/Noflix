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
import { gql, useMutation } from "@apollo/client";
import { authUser, email } from "../Reducers/UserSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../app/store";

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

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [valid, setValid] = useState(true);
  // const authUserState = useSelector((state: RootState) => state.user.authUser);

  const [authUserMutation] = useMutation(AUTH_USER_MUTATION);
  const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
  const [emailString, setEmail] = useState<string>("");
  const [passwordString, setPassword] = useState<string>("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);

    if (emailString != undefined && passwordString != undefined) {
      try {
        const { data } = await authUserMutation({
          variables: { email: emailString, password: passwordString },
        });

        if (data.authUser.success && emailString != null) {
          dispatch(authUser(true));
          dispatch(email(emailString));
          navigate("/");
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (error) {
        setValid(false);
        console.error("Auth failed", error);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const { data } = await createUserMutation({
        variables: { email: emailString, password: passwordString },
      });

      if (
        data.userCreate.userModel.email &&
        data.userCreate.userModel.password
      ) {
        setValid(true);
        dispatch(authUser(true));
        dispatch(email(emailString));
        navigate("/");
      }
    } catch (error) {
      setValid(false);
      console.error("UserCreate failed", error);
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          {/* <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {!valid && (
            <>
              <h3>Something went wrong. Try again.</h3>
              <h3>
                Not already a user?{/*Kill yourself.*/}{" "}
                <button onClick={handleSignIn}>SIGN IN</button>
              </h3>{" "}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
