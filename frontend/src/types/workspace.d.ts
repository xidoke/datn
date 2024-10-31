export interface IWorkspace {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface IWorkspaceLite {
  readonly id: string;
  name: string;
  logo: string;
  slug: string;
}