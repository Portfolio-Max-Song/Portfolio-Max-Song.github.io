// Single source of truth for identity, nav, and social links. Editing this
// updates every page that renders them.
export const site = {
  name: 'Max Song',
  tagline: 'an engineering portfolio',
  description:
    'Mechanical engineering portfolio of Max Song — composites manufacturing, machining, CAD, and product design.',
  email: 'maxsong@utexas.edu',
  resume: '/Song_Max_EngResume.pdf',
};

export const nav = [
  { label: 'Home', href: '/#wrapper' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Projects', href: '/projects.html' },
  { label: 'Resume', href: site.resume, external: true },
];

// `icon` keys map to the inlined brand marks in components/SocialIcon.astro.
export const socials = [
  { label: 'Email', href: `mailto:${site.email}`, icon: 'google' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maxsongut/', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/max_song_', icon: 'instagram' },
  { label: 'GitHub', href: 'https://github.com/Max-Song-04', icon: 'github' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/carvelikebuttershop/', icon: 'pinterest' },
];
