---
title: Thin-Shell Elastomer Casting for Acoustic Metamaterials
org: Architected Intelligent Matter Laboratory – University of Houston
date: June – September 2025
order: 4
blurb: >-
  Materials research intern in Dr. Tian Chen's lab at the University of Houston.
  I developed a layered casting method that produced thin-shell elastomer
  half-spheres to within 0.2 mm, then got the simulations to agree with the parts
  by calibrating material models against my own tensile test data.
description: >-
  Materials research at the University of Houston's Architected Intelligent
  Matter Laboratory — a layered casting method holding 0.2 mm on thin-shell
  elastomer half-spheres, and Abaqus modal models calibrated against ASTM D412
  tensile data and OpenCV video extensometry.
skills:
  - Abaqus FEA (Static, Modal)
  - Mechanical Testing (Instron, ASTM D412)
  - Python (OpenCV, NumPy, Pandas)
  - Precision Mold Design
  - Laser Cutting
  - Elastomer Casting
gallery: []
---

<!-- TODO Max: photos needed. Good candidates, in priority order:
     1. a cast half-sphere in hand or on the bench (the hero shot)
     2. the steel ball mold with the acrylic jig set up
     3. a specimen in the Instron grips mid-test
     4. a screenshot of an Abaqus modal result
     Drop them in ./images/ and add `hero:` plus gallery entries above. -->

I spent the summer of 2025 as a materials research intern at the
[Architected Intelligent Matter Laboratory](https://aim.me.uh.edu/) at the
University of Houston, a lab that designs materials whose behavior comes from
their geometry rather than their chemistry. My work supported the group's
acoustic metamaterial research, where the acoustic response depends on the shell
geometry holding tight tolerances.

## Outcome

I developed a layered casting method that produced thin-shell elastomer
half-spheres to within **0.2 mm** of nominal — accurate enough for the acoustic
work downstream to treat the geometry as known rather than as a variable. I then
improved the accuracy of the lab's Abaqus modal simulations by **10%** by
calibrating the material models against tensile data I generated myself, and
automated the characterization workflow in Python, **cutting analysis time by
60%**.

## My Role

I owned the casting process and the material characterization end to end: mold
and jig design, specimen casting, tensile testing, extracting material
properties, feeding them into the simulation models, and building the scripts
that turned test video into usable data.

## Context and Constraints

A four-month summer internship. The parts are thin-shell hemispheres, which is
the hard case for casting — wall thickness wants to vary with gravity and with
how the elastomer wets the mold, and a thin shell has no stiffness to resist
being distorted on release.

## Approach

**Casting.** Rather than casting the shell in one pour, I built the method up in
layers, which let me control wall thickness instead of fighting it. The mold is
a precision steel ball, chosen because it comes dimensionally accurate off the
shelf and holds its finish, paired with a laser-cut acrylic jig that keeps the
ball concentric and repeatably located between layers. The jig is the reason the
process repeats: it takes the part's accuracy out of the operator's hands.

**Characterization.** Simulation for elastomers is only as good as the material
model, so I ran tensile tests to **ASTM D412** on an Instron and used **OpenCV
video extensometry** to track strain optically instead of relying on grip
displacement, which overstates strain on a soft material. Fitting the models to
that data is what closed the 10% gap between the modal simulations and the
measured behavior.

**Automation.** The characterization sequence was repetitive enough to script.
Automating it in Python took the analysis loop down by about 60%, which mattered
because every material batch needed recharacterizing.

## What I'd Change

<!-- TODO Max: this section is the one I can't write for you. Two prompts:
     - What failed first? (layers delaminating, bubbles, release tearing,
       thickness drift, something else) and what did you change?
     - What would you do differently on the mold or the jig next time? -->

## Validation

Dimensional accuracy was checked against nominal on the cast parts, holding
0.2 mm. The simulation work was validated the other direction: the calibrated
material model was scored against measured modal behavior, and the 10% figure is
the reduction in that disagreement.
