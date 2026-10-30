import { type ComponentPropsWithRef, createContext, useContext } from "react";
import { cn } from "../utils/cn";

/** Row density: comfortable is the default; compact suits ops queues. */
export type TableDensity = "comfortable" | "compact";

const TableDensityContext = createContext<{
  density: TableDensity;
  stickyHeader: boolean;
}>({ density: "comfortable", stickyHeader: false });

export type TableProps = ComponentPropsWithRef<"table"> & {
  /**
   * U5 density story: comfortable keeps the default cell rhythm, compact
   * tightens header/cell padding for dense ops queues. Defaults to
   * comfortable, so existing tables render byte-identically.
   */
  density?: TableDensity;
  /**
   * U5 pinning story: stick the header row on vertical scroll. The head
   * keeps its tonal fill, so stuck headers stay legible over rows.
   */
  stickyHeader?: boolean;
};
export type TableHeadProps = ComponentPropsWithRef<"thead">;
export type TableBodyProps = ComponentPropsWithRef<"tbody">;
export type TableRowProps = ComponentPropsWithRef<"tr">;
export type TableHeaderProps = ComponentPropsWithRef<"th">;
export type TableCellProps = ComponentPropsWithRef<"td">;
export type TableCaptionProps = ComponentPropsWithRef<"caption">;

export function TableRoot({
  className,
  density = "comfortable",
  stickyHeader = false,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-wrapper"
      data-density={density}
      data-sticky-header={stickyHeader || undefined}
      className="kern-table-wrapper overflow-x-auto rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant)"
    >
      <TableDensityContext.Provider value={{ density, stickyHeader }}>
        <table
          data-slot="table"
          className={cn(
            "kern-table w-full border-collapse text-left text-sm text-(--sys-color-on-surface)",
            className,
          )}
          {...props}
        />
      </TableDensityContext.Provider>
    </div>
  );
}

export function TableHead({ className, ...props }: TableHeadProps) {
  const { stickyHeader } = useContext(TableDensityContext);
  return (
    <thead
      data-slot="table-head"
      className={cn(
        "kern-table-head bg-(--sys-color-surface-tonal)",
        stickyHeader && "sticky top-0 z-10",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody(props: TableBodyProps) {
  return <tbody data-slot="table-body" {...props} />;
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "kern-table-row border-t border-(--sys-color-outline-variant) first:border-t-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  const { density } = useContext(TableDensityContext);
  return (
    <th
      data-slot="table-header"
      scope="col"
      className={cn(
        "kern-table-header text-xs font-medium text-(--sys-color-on-surface-variant)",
        density === "compact" ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TableCellProps) {
  const { density } = useContext(TableDensityContext);
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "kern-table-cell",
        density === "compact" ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "kern-table-caption px-4 py-2 text-xs text-(--sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Semantic data table with header scope and container styling. */
export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Header: TableHeader,
  Cell: TableCell,
  Caption: TableCaption,
};
