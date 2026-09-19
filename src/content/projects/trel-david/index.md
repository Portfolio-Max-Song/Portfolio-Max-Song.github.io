---
title: Texas Rocket Engineering Lab (David's Cut)
org: Texas Rocket Engineering Lab
role: Structures Engineer
date: September 2024 – present
order: 2
blurb: >-
  Previously on the structures and composites team, now a structures engineer
  for the Texas Rocket Engineering Lab's (TREL) Halcyon Mark 1 rocket. Laid up
  composite parts for the rocket's body and designed the manufacturing process
  behind the 4-foot fiberglass nosecone. On the Orbital Test Stand, modeled
  the stand site for systems integration and designed the pressure transducer
  bracket.
description: >-
  Composites manufacturing and structures work at the Texas Rocket Engineering
  Lab — carbon fiber skirts and couplers validated to 9,600 lbf axial load, a
  48-inch fiberglass nosecone mold, and an ACI 318 concrete bolt calculator
  for a 30-foot hot-fire engine test stand.
skills:
  - Composite Layups (Vacuum Bagging, Resin Infusion)
  - Design for Manufacturing (DFM)
  - Structural Analysis
  - SolidWorks
  - Large-Format 3D Printing
  - Technical Documentation
hero: ./images/vacuum-bagging.jpg
heroAlt: Vacuum bagging a carbon fiber rocket skirt
gallery:
  - src: ./images/skirt-bagging.jpg
    alt: Rocket skirt under vacuum bag
  - src: ./images/skirt-waxing.jpg
    alt: Waxing the skirt mold before layup
  - src: ./images/access-port.jpg
    alt: Access port cut through the carbon fiber skirt
  - src: ./images/nosecone-mold.jpg
    alt: Nosecone mold design
  - src: ./images/nosecone-sliced.jpg
    alt: Nosecone mold sliced into printable sections
  - src: ./images/hole-render.jpg
    alt: Render of the orbital test stand site
  - src: ./images/bolt-analysis.jpg
    alt: Concrete bolt analysis work
  - src: ./images/hole-3.jpg
    alt: The test stand site during survey
---

Since Fall 2024, I've been a structures and manufacturing engineer at the Texas Rocket Engineering Lab (TREL). I joined the Halcyon division right as the team moved out of design and into physical manufacturing for the Mark 1 rocket. 

My work focused heavily on composite layups for the skirts, raceway mounts, and nose cone, before pivoting to heavy structural engineering for the Orbital Test Stand.

## Carbon Fiber Manufacturing

![Waxing the skirt mold before layup](./images/skirt-waxing.jpg)
![Rocket skirt under vacuum bag](./images/skirt-bagging.jpg)

<p class="caption">Waxing the mandrels (left) and vacuum bagging the carbon fiber rocket skirt (right).</p>

I laid up carbon fiber and fiberglass parts using both prepregs and wet layups. One of my first real jobs was cutting the critical access ports for the fluid lines passing through the carbon fiber skirt. 

The stakes were high: one bad cut and you ruin a multi-thousand dollar composite part. With no proper ventilation in the facility, I spent hours in the Texas sun with a drill and a rotary tool, carefully working through layers of carbon fiber. It was my favorite work that semester — getting my hands dirty and holding the hardware made the stakes feel real.

## The Nose Cone Mold

The problem: design a 4-foot rocket nose cone mold around an existing geometry, accounting for composite resin shrinkage and vacuum bagging realities. And do it all in one month before production started.

![Nosecone mold design](./images/nosecone-mold.jpg)
![Nosecone mold sliced into printable sections](./images/nosecone-sliced.jpg)

<p class="caption">The full CAD assembly of the nose cone mold (left) and the slice plan for 3D printing (right).</p>

I engineered a three-piece split mold design in CAD so the cured tip could be released without fighting a vacuum. We chose ABS for its ability to smooth perfectly with isopropyl alcohol. 

What actually happened? The plan fell apart. ITAR restrictions locked us out of the university's large-format printers. Budget constraints forced us onto cheap PLA. A donated, aging Gigabot printer burned its extruder out the week we needed it. Ultimately, we had to pivot entirely and do the layup on a deformed legacy nose cone smoothed with expanding foam.

I was disappointed, but I learned a brutal engineering lesson: **Always confirm the entire manufacturing pipeline before finishing the design.** Having a perfect CAD model means nothing if the supply chain or machine access doesn't exist.

## The Orbital Test Stand

In Spring 2025, I moved to the Orbital Test Stand division to build a 30-foot deep hot-fire engine test stand at the J. J. Pickle Research Campus.

![Render of the orbital test stand site](./images/hole-render.jpg)
![The test stand site during survey](./images/hole-3.jpg)

<p class="caption">The fully dimensioned site CAD (left) matching the physical hole during a site survey (right).</p>

Other teams were completely blocked on systems integration because no master CAD of the physical environment existed. Working off a handful of photos, rough dimensions, and a mandate to build it "as fast as possible," I created the master 3D model of "The Hole." I modeled the site down to the exact metal grating patterns, ensuring structural teams could definitively check their clearances.

Finally, a teammate and I engineered an automated calculator for concrete bolt analysis. We took the ACI 318 governing formulas and built an extensive tool to calculate final bolt diameter, required embedment, plate thickness, and bolt count given any dynamic load, factoring in a strict 4x safety margin for the 10,000+ lbf engine tests.
