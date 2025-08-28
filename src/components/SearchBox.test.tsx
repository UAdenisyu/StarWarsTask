import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBox from "./SearchBox";

describe("SearchBox", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with label and initial value", () => {
    render(<SearchBox value="Luke" onChange={() => {}} label="Search characters" />);
    const input = screen.getByLabelText(/search characters/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Luke");
  });

  it("debounces onChange and calls once with final value", () => {
    const handleChange = vi.fn();
    render(<SearchBox value="" onChange={handleChange} debounceMs={200} label="Search" />);

    const input = screen.getByLabelText(/search/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "L" } });
    fireEvent.change(input, { target: { value: "Lu" } });
    fireEvent.change(input, { target: { value: "Luk" } });
    fireEvent.change(input, { target: { value: "Luke" } });

    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("Luke");
  });

  it("updates input when external value prop changes", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <SearchBox value="An" onChange={handleChange} debounceMs={200} label="Search" />
    );

    const input = screen.getByLabelText(/search/i) as HTMLInputElement;
    expect(input.value).toBe("An");

    rerender(<SearchBox value="Anakin" onChange={handleChange} debounceMs={200} label="Search" />);
    expect(input.value).toBe("Anakin");
  });

  it("uses custom debounceMs", () => {
    const handleChange = vi.fn();
    render(<SearchBox value="" onChange={handleChange} debounceMs={50} label="Search" />);

    const input = screen.getByLabelText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "R2" } });

    act(() => {
      vi.advanceTimersByTime(49);
    });
    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("R2");
  });
});
