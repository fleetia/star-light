export function setCSSVariable(key: string, value: string): void {
  document.documentElement.style.setProperty(key, value);
}

export function setCSSVariables(variables: Record<string, string>): void {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
