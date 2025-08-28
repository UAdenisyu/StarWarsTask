import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectInput from "./SelectInput";

describe("SelectInput", () => {
  it("renders label and current value", () => {
    render(<SelectInput gender="male" onChange={() => {}} />);
    const trigger = screen.getByRole("combobox", { name: /gender/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent(/male/i);
  });

  it("opens menu and calls onChange with selected option", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SelectInput gender={null} onChange={handleChange} />);

    const trigger = screen.getByRole("combobox", { name: /gender/i });
    await user.click(trigger);

    const listbox = await screen.findByRole("listbox");
    const option = within(listbox).getByRole("option", { name: /^female$/i });
    await user.click(option);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("gender", "female");
  });

  it("shows no value when gender is null until selection is made", async () => {
    const user = userEvent.setup();
    render(<SelectInput gender={null} onChange={() => {}} />);

    const trigger = screen.getByRole("combobox", { name: /gender/i });
    expect(trigger).not.toHaveTextContent(
      /male|female|hermaphrodite|none|unknown|n\/a|programming/i
    );

    await user.click(trigger);
    const listbox = await screen.findByRole("listbox");
    const selected = within(listbox).queryAllByRole("option", { selected: true });
    expect(selected.length).toBe(0);
  });
});
