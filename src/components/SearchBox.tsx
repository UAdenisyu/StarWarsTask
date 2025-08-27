import { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  label?: string;
};

export default function SearchBox({ value, onChange, debounceMs = 350, label = "Search" }: SearchBoxProps) {
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
    <TextField
      fullWidth
      value={inner}
      label={label}
      placeholder="Type to search people"
      onChange={(e) => {
        const v = e.target.value;
        setInner(v);
        debounced(v);
      }}
    />
  );
}