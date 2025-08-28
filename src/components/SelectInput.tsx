import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { memo, type FC } from "react";
import type { CharacterEditPatch } from "../services/localEdits";

type SelectInputProps = {
  gender: string | null;
  onChange: (field: keyof CharacterEditPatch, value: string) => void;
};

const SelectInput: FC<SelectInputProps> = memo(({ gender, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="gender-label">Gender</InputLabel>
      <Select
        labelId="gender-label"
        label="Gender"
        value={gender ?? ""}
        onChange={(e) => onChange("gender", e.target.value.toString())}
      >
        <MenuItem value="male">male</MenuItem>
        <MenuItem value="female">female</MenuItem>
        <MenuItem value="n/a">n/a (droid)</MenuItem>
        <MenuItem value="hermaphrodite">hermaphrodite</MenuItem>
        <MenuItem value="none">none</MenuItem>
        <MenuItem value="unknown">unknown</MenuItem>
        <MenuItem disabled>──────────</MenuItem>
        <MenuItem value="masculine programming">masculine programming (droid)</MenuItem>
        <MenuItem value="feminine programming">feminine programming (droid)</MenuItem>
        <MenuItem value="no gender programming">no gender programming (droid)</MenuItem>
      </Select>
    </FormControl>
  );
});

export default SelectInput;
