import {
  type AnchorHTMLAttributes,
  createContext,
  type ReactNode,
  useContext,
} from "react";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Router location (when the host router uses one). */
  to?: string;
};

export type LinkComponent = (props: LinkProps) => ReactNode;

const LinkContext = createContext<LinkComponent | null>(null);

/** Inject the host router's link (e.g. TanStack `Link`). Default renders `<a>`. */
export function LinkProvider({
  component,
  children,
}: {
  component: LinkComponent;
  children: ReactNode;
}) {
  return (
    <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
  );
}

export function useLinkComponent(): LinkComponent {
  const component = useContext(LinkContext);
  return (
    component ??
    (({ to, href, ...props }: LinkProps) => <a href={href ?? to} {...props} />)
  );
}

/** Seam-rendered link: `to` when a router is injected, `href` otherwise. */
export function Link({ to, href, ...props }: LinkProps) {
  const Component = useLinkComponent();
  return <Component to={to} href={href} {...props} />;
}
