import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import type { FC } from "react";

type PaginationBarProps = {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
};

const PaginationBar: FC<PaginationBarProps> = ({ page, total, pageSize, onChange }) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <Stack alignItems="center" sx={{ py: 2 }}>
      <Pagination page={page} count={pageCount} onChange={(_, p) => onChange(p)} color="primary" />
    </Stack>
  );
};

export default PaginationBar;
