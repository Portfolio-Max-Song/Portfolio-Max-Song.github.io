// Single source of truth for identity, nav, and social links. Editing this
// updates every page that renders them.
export const site = {
  name: 'Max Song',
  tagline: 'an engineering portfolio',
  description:
    'Mechanical engineering portfolio of Max Song — test fixture design, composites manufacturing, machining, CAD, and product design.',
  email: 'maxsong@utexas.edu',
  resume: '/Song_Max_EngResume.pdf',
};

export const nav = [
  { label: 'Home', href: '/#wrapper' },
  { label: 'About', href: '/about.html' },
  { label: 'Projects', href: '/projects.html' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Resume', href: site.resume, external: true },
];

// Outbound links to the places Max has worked, referenced from the Home blurb
// and the About page so the URL lives in one spot.
export const orgs = {
  contoro: 'https://contoro.com/',
  trel: 'https://texasrocketlab.ae.utexas.edu/',
  inventionworks: 'https://inventionworks.engr.utexas.edu/',
  aimLab: 'https://aim.me.uh.edu/',
  songLeather: 'https://sites.google.com/view/songleather/home',
};

// `icon` keys map to the inlined brand marks in components/SocialIcon.astro.
export const socials = [
  { label: 'Email', href: `mailto:${site.email}`, icon: 'google' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maxsongut/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/Max-Song-04', icon: 'github' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/carvelikebuttershop/', icon: 'pinterest' },
];
