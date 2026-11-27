export interface NavigationLink {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

export interface NavigationSection {
  readonly title: string;
  readonly links: readonly NavigationLink[];
}

export const NAVIGATION_SECTIONS: readonly NavigationSection[] = [
  {
    title: 'Guide',
    links: [
      {label: 'Home', path: '/', icon: 'home'},
      {label: 'Getting started', path: '/getting-started', icon: 'rocket_launch'}
    ]
  },
  {
    title: 'Validators',
    links: [
      {label: 'fpEmail', path: '/validators/email', icon: 'alternate_email'},
      {label: 'fpPostCode', path: '/validators/post-code', icon: 'markunread_mailbox'}
    ]
  }
];
