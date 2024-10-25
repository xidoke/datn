import {
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
  groupLabelHidden?: boolean;
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Workspace',
      menus: [
        {
          href: '/workspaces',
          label: 'Workspace',
          icon: SquarePen,
          submenus: [],
        },
      ],
      groupLabelHidden: true,
    },
    {
      groupLabel: 'Project',
      menus: [
        {
          href: '/project',
          label: 'Project',
          icon: Bookmark,
          submenus: [],
        },
      ],
      groupLabelHidden: true,
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: '/account',
          label: 'Account',
          icon: Settings,
        },
      ],
    },
  ];
}
