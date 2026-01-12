/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

declare module "*.svg?svgr" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  export default ReactComponent;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type EmtyObject = Record<string, never>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type UnknownObject = Record<string, unknown>;
type PropsOf<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<unknown>,
> = JSX.LibraryManagedAttributes<T, React.ComponentPropsWithoutRef<T>>;

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PolymorphicComponentProps<
  T extends React.ElementType,
  Props = UnknownObject,
> = Props & AsProp<T> & Omit<PropsOf<T>, keyof (Props & AsProp<T>)>;

type PolymorphicRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>["ref"];
type PolymorphicComponentPropsWithRef<
  T extends React.ElementType,
  Props = UnknownObject,
> = PolymorphicComponentProps<T, Props> & { ref?: PolymorphicRef<T> };

type PolymorphicComponentWithRef<
  T extends React.ElementType = "div",
  Props = UnknownObject,
> = <E extends React.ElementType = T>(
  props: PolymorphicComponentPropsWithRef<E, Props>
) => ReactNode;
