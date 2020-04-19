/// <reference types="react-scripts" />

// Remove this once this issue is resolved: https://github.com/react-spring/react-spring/issues/613
declare module "react-spring" {
  export const useSpring: any;
  export const animated: any;
}
