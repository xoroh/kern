import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type TableProps = ComponentPropsWithRef<"table">;
export type TableHeadProps = ComponentPropsWithRef<"thead">;
export type TableBodyProps = ComponentPropsWithRef<"tbody">;
export type TableRowProps = ComponentPropsWithRef<"tr">;
export type TableHeaderProps = ComponentPropsWithRef<"th">;
export type TableCellProps = ComponentPropsWithRef<"td">;
export type TableCaptionProps = ComponentPropsWithRef<"caption">;

export function TableRoot({ className, ...props }: TableProps) {
  return (
    <div
      data-slot="table-wrapper"
      className="kern-table-wrapper overflow-x-auto rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)"
    >
      <table
        data-slot="table"
        className={cn(
          "kern-table w-full border-collapse text-left text-sm text-(--md-sys-color-on-surface)",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <thead
      data-slot="table-head"
      className={cn(
        "kern-table-head bg-(--md-sys-color-surface-tonal)",
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
        "kern-table-row border-t border-(--md-sys-color-outline-variant) first:border-t-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <th
      data-slot="table-header"
      scope="col"
      className={cn(
        "kern-table-header px-4 py-3 text-xs font-medium text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn("kern-table-cell px-4 py-3", className)}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "kern-table-caption px-4 py-2 text-xs text-(--md-sys-color-on-surface-variant)",
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
