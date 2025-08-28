import type { SetURLSearchParams } from "react-router-dom";

export const setPage = (next: number, setParams: SetURLSearchParams) => {
  setParams(
    (prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(next));
      return p;
    },
    { replace: true }
  );
};

export const setSearch = (next: string, setParams: SetURLSearchParams) => {
  setParams(
    (prev) => {
      const p = new URLSearchParams(prev);
      if (next) {
        p.set("search", next);
      } else {
        p.delete("search");
      }
      p.set("page", "1");
      return p;
    },
    { replace: true }
  );
};
