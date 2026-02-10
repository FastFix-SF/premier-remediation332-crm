export interface ThemeConfig {
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    destructive: string;
    destructiveForeground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    section: string;
    container: string;
  };
}

export interface NavigationConfig {
  mainMenu: NavMenuItem[];
  footerMenu: {
    company: NavMenuItem[];
    services: NavMenuItem[];
    areas: NavMenuItem[];
  };
  features: {
    storeEnabled: boolean;
    blogEnabled: boolean;
    chatEnabled: boolean;
  };
}

export interface NavMenuItem {
  label: string;
  href: string;
  children?: NavMenuItem[];
  isExternal?: boolean;
  icon?: string;
}
