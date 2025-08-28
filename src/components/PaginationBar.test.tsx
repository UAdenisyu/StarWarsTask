import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationBar from "./PaginationBar";

describe("PaginationBar", () => {
  it("renders with calculated page count", () => {
    render(<PaginationBar page={1} total={95} pageSize={10} onChange={() => {}} />);

    const currentBtn = screen.getByRole("button", { current: "page" });
    expect(currentBtn).toHaveAccessibleName(/^page 1$/i);

    expect(screen.getByRole("button", { name: /go to page 10/i })).toBeInTheDocument();
  });
  it("calls onChange with selected page when a page is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PaginationBar page={1} total={30} pageSize={10} onChange={handleChange} />);
    await user.click(screen.getByRole("button", { name: /go to page 2/i }));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("respects current page prop", () => {
    render(<PaginationBar page={3} total={50} pageSize={10} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /page 3/i })).toHaveAttribute("aria-current", "page");
  });
});
