# Open content items

Tracked here rather than as HTML comments in the markdown, because comments in
a content file ship to the published page source where anyone can read them.

Nothing here blocks a deploy — the site builds and reads well as-is. These are
the gaps worth closing before you start sending the link out.

## Blocking-ish

- [ ] **PL-8 dates.** `src/content/projects/pl8/index.md` currently has
      `date: Dates to confirm`, and that string renders on the projects index.
      Fix before pushing.
- [ ] **Contoro job title.** The site says "Robotics Engineering Intern"
      (home blurb + the Contoro page's `org` field); your résumé says
      "Mechanical Engineering Co-op." Recruiters cross-check the two. Pick one
      and make both match.

## "What I'd change" sections

Both career-centre sources in the research say a portfolio should show setbacks
and what you learned. Two pages are missing that section because only you know
the answer.

- [ ] **Contoro.** The PDR shows this went to Rev B — bearings changed to the
      UCP206, shaft to the Misumi NSFRBF, and the gripper interface redesigned
      as a clamping collar. *What drove those changes?* That story is the
      section. Also: what did the test stand's first revision get wrong?
- [ ] **A.I.M. Lab.** What failed first in the casting process — delamination,
      bubbles, tearing on release, thickness drift? What did you change? And
      what would you do differently on the mold or the jig?

## Photos

- [ ] **A.I.M. Lab has no images at all.** The page is written and builds
      without them (`hero` is optional now), but it shows a blank tile on the
      projects index. In priority order: a cast half-sphere on the bench (this
      becomes the hero), the steel ball mold with the acrylic jig set up, a
      specimen in the Instron grips, an Abaqus modal result screenshot. Drop
      them in `src/content/projects/aim-lab/images/` and add `hero:` plus
      gallery entries.
- [ ] **Three more life photos** to fill the About page grid to a full 3×3.
      Six are in there now. Add to `src/assets/images/social/` and list them in
      `src/pages/about.astro`.

## Prose still on the old copy

Structure is done on these, but the writing predates the eight-block template.
Contoro and A.I.M. Lab are the two written to the new standard — use them as
the reference.

- [ ] **TREL** — has the best raw numbers on the site going unused: 9,600 lbf
      axial validation, the 48-inch nosecone, the ACI 318 calculator hitting
      150% load capacity with a reduced fastener count.
- [ ] **Texas Inventionworks** — currently reads as "I ran trainings." Your
      résumé says you direct 10+ student staff, wrote PMs and SOPs for 12+
      machines, raised equipment uptime 20%, and taught 100+ students. None of
      that is on the page.
- [ ] **PL-8** — needs an explicit "I owned…" line. It was a two-person shell
      team, so your contribution is legible, but the page doesn't say it.
- [ ] **Personal Projects** — six sections merged onto one page. The intro is
      rewritten; the sections below it are the original copy and could each lose
      about a third of their length. The shoe rack's $9.09-versus-$23 costing is
      the best quantified detail on the page — don't bury it.

## Deploy

- [ ] **Settings → Pages → Source must be "GitHub Actions"**, not "Deploy from
      a branch." The workflow at `.github/workflows/deploy.yml` builds on every
      push to `main`. Until the source is switched, pushing changes nothing.
- [ ] Nothing is live yet. `origin/main` is still `94d2e37`, the old pre-Astro
      site. The first `git push` replaces it.

## Not for publication

Kept local, and `pics/` is gitignored so they can't be committed by accident:

- The four `Gripper Stand BOM` CSVs — Contoro's sourcing information.
- `project_calcdoc.pdf` — the full PDR document.
- `social_amazon1–4.JPG` — taken inside a customer's fulfillment centre.

The engineering reasoning and your own hand calculations are on the Contoro
page; the source documents are not.
