import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0D0D0D" },
    background: { default: "#fafafa" },
  },
  shape: { borderRadius: 14 },
});

export default appTheme;
