# Open content items

Tracked here rather than as HTML comments in the markdown, because comments in
a content file ship to the published page source where anyone can read them.

Nothing here blocks a deploy — the site builds and reads well as-is. These are
the gaps worth closing before you start sending the link out.

## Next up — home page tweaks (requested, not yet started)

One left; nothing here is half-built.

- [ ] **Centre the contact icons** under the last line of the home blurb.
      `.icons-inline` in site.css currently sets `justify-content: flex-start`.
- [x] ~~Put the headshot back.~~ Done — it sits beside the name in the home
      page hero.
- [x] ~~Contoro logo beside the Contoro link.~~ Done — `public/images/contoro-mark.png`,
      drawn by `OrgMark`.
- [x] ~~Add "(TIW)" after Texas Inventionworks.~~ Done.

Links are already correct and live on the page: Contoro, Texas Inventionworks
and TREL all point at the right URLs.

## Then — the projects work, in order

1. The projects index page itself (card copy, shorter descriptions).
2. Each project page one by one.

## Blocking-ish

- [x] ~~PL-8 dates.~~ Done — August 2024 – January 2025.
- [ ] **Contoro job title.** The site says "Robotics Engineering Intern"
      (home blurb + the Contoro page's `org` field); your résumé says
      "Mechanical Engineering Co-op." Recruiters cross-check the two. Pick one
      and make both match.

## "What I'd change" sections

Both career-centre sources in the research say a portfolio should show setbacks
and what you learned.

- [ ] **Contoro.** The PDR shows this went to Rev B — bearings changed to the
      UCP206, shaft to the Misumi NSFRBF, and the gripper interface redesigned
      as a clamping collar. *What drove those changes?* That story is the
      section. Also: what did the test stand's first revision get wrong?
- [x] ~~A.I.M. Lab.~~ Done — wall thickness drift, written up with the fix
      (rotate the mold during cure, measure the finished wall rather than
      trusting the process).

## Photos

- [x] ~~A.I.M. Lab has no images.~~ Done — 15 images pulled from the research
      folder, including the OpenCV tracker frame with its calibration printout
      visible.
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

Kept local. Both `pics/` and `25Summer_Res/` are gitignored so nothing here can
be committed by accident:

- The four `Gripper Stand BOM` CSVs — Contoro's sourcing information.
- `project_calcdoc.pdf` — the full PDR document.
- `social_amazon1–4.JPG` — taken inside a customer's fulfillment centre.
- Everything in `25Summer_Res/` — the A.I.M. Lab's research data. Only the 15
  images copied into the aim-lab project folder are published.

## Research folder cleanup — done

`25Summer_Res/` went from 88 GB to 4.7 GB. All of the reclaimed space was raw
camera footage (1080p at 120 fps, which is why single captures ran past 20 GB);
the NAS holds the originals. Every script, notebook, CSV, extracted still and
derived clip was kept, plus 36 frames pulled out of videos before deleting them
(`25Summer_Res/_extracted_frames/`).

The engineering reasoning and your own hand calculations are on the Contoro
page; the source documents are not.

## Projects section — status

Done: card layout (org name + date top-right, rule under the title, no "Read
more", uniform 16rem cards, 4:5 thumbnails); org/role split; all seven card
titles and blurbs in Max's own words; Song Leather split out as its own project;
Personal Projects led by the record player; PL-8 dates.

Still open:

1. **Project page bodies.** TREL, Texas Inventionworks, PL-8 and Personal
   Projects still run the prose written before the Contoro / A.I.M. Lab
   template. TREL has the most unused material: 9,600 lbf axial validation, the
   ACI 318 calculator hitting 150% load capacity with fewer fasteners, and the
   30-ft test stand CAD with 30+ components.
2. **Contoro "What I'd Change"** — needs Max's account of what drove the Rev B
   changes (UCP206 bearings, Misumi NSFRBF shaft, clamping-collar interface).
3. **PL-8 page body** still describes seven composite panels; the new blurb
   leads on full systems integration with chassis and powertrain, so the page
   should cover that too.
4. **Three more life photos** for the About 3x3 grid (6 of 9 present).
5. **Job title mismatch** — the site says "Robotics Engineering Intern", the
   resume PDF says "Mechanical Engineering Co-op".
6. **December 2027 graduation** appears nowhere on the site.
7. **Settings -> Pages -> Source must be "GitHub Actions"** before any push
   deploys. Nothing has been pushed; origin/main is still 94d2e37.

