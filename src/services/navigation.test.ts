import { describe, it, expect, vi } from "vitest";
import { setPage, setSearch } from "./navigation";

describe("navigation", () => {
  describe("setPage", () => {
    it("sets page=3 on top of existing params", () => {
      const setParams = vi.fn();

      setPage(3, setParams);

      expect(setParams).toHaveBeenCalledTimes(1);
      const [updater, options] = setParams.mock.calls[0];
      expect(typeof updater).toBe("function");
      expect(options).toEqual({ replace: true });

      const params = new URLSearchParams("foo=bar&baz=qux");
      const newParams = updater(params);
      expect(newParams.get("page")).toBe("3");
      expect(newParams.get("foo")).toBe("bar");
      expect(newParams.get("baz")).toBe("qux");
    });
  });

  describe("setSearch", () => {
    it('sets search="obi" and resets page=1', () => {
      const setParams = vi.fn();

      setSearch("obi", setParams);

      expect(setParams).toHaveBeenCalledTimes(1);
      const [updater, options] = setParams.mock.calls[0];
      expect(typeof updater).toBe("function");
      expect(options).toEqual({ replace: true });

      const params = new URLSearchParams("page=5&foo=bar");
      const newParams = updater(params);
      expect(newParams.get("search")).toBe("obi");
      expect(newParams.get("page")).toBe("1");
      expect(newParams.get("foo")).toBe("bar");
    });

    it("deletes search and resets page=1 when search is empty string", () => {
      const setParams = vi.fn();

      setSearch("", setParams);

      expect(setParams).toHaveBeenCalledTimes(1);
      const [updater, options] = setParams.mock.calls[0];
      expect(typeof updater).toBe("function");
      expect(options).toEqual({ replace: true });

      const params = new URLSearchParams("search=old&page=5&foo=bar");
      const newParams = updater(params);
      expect(newParams.has("search")).toBe(false);
      expect(newParams.get("page")).toBe("1");
      expect(newParams.get("foo")).toBe("bar");
    });
  });
});
