import { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  label?: string;
};

export default function SearchBox({
  value,
  onChange,
  debounceMs = 350,
  label = "Search",
}: SearchBoxProps) {
  const [inner, setInner] = useState(value);
  const debounced = useMemo(() => {
    let timer: number | undefined;
    return (v: string) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onChange(v), debounceMs);
    };
  }, [onChange, debounceMs]);

  useEffect(() => {
    setInner(value);
  }, [value]);

  return (
    <Box sx={textFieldSx}>
      <TextField
        fullWidth
        value={inner}
        label={label}
        sx={layoutSx}
        placeholder="Type to search characters"
        onChange={(e) => {
          const v = e.target.value;
          setInner(v);
          debounced(v);
        }}
      />
    </Box>
  );
}

const layoutSx = {
  bgcolor: "background.default",
  boxShadow: 2,
  borderRadius: 1,
} as const;

const textFieldSx = {
  padding: 2,
  bgcolor: "background.default",
  borderRadius: 1,
} as const;
