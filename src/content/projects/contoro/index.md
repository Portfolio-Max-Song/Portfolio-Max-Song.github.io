---
title: Contoro Robotics
org: Contoro Robotics
role: Robotics Engineering Intern
date: January – August 2026
order: 1
blurb: >-
  Robotics engineering intern at Contoro Robotics, a shipping-container
  unloading startup in Austin. Worked across the full manufacturing process,
  from design to assembly drawings to testing. For my final project I created
  an end-of-line test stand for the end effector, validating every unit before
  it shipped.
description: >-
  Mechanical engineering work at Contoro Robotics — an end-of-line gripper
  validation test stand with its own IO-Link control hardware and FastAPI test
  app, a cantilevered gripper assembly stand sized against bearing load ratings
  with a 16x margin, production drawings and BOMs across two gripper hardware
  revisions, and field support at customer warehouses.
skills:
  - Test Fixture Design
  - SolidWorks (Assemblies, Drawings, BOMs)
  - Hand Calculations & Structural Analysis
  - Pneumatics (Festo, IO-Link, Modbus TCP)
  - Python (FastAPI, Test Automation)
  - Design for Manufacturing & Assembly
hero: ./images/test-stand.jpg
heroAlt: The end-of-line gripper test stand, built as a rolling cart
gallery:
  - src: ./images/test-stand-cad.png
    alt: CAD assembly of the mobile test stand
  - src: ./images/test-stand-cad-detail.png
    alt: Detail view of the test stand CAD
  - src: ./images/assembly-stand-cad.png
    alt: CAD of the cantilevered gripper assembly stand
  - src: ./images/assembly-stand-cad-2.png
    alt: Second view of the assembly stand CAD
  - src: ./images/gripper-stand.jpg
    alt: The gripper mounted on the assembly stand
  - src: ./images/gripper-manufacturing-1.jpg
    alt: Gripper end-effector assembly on the bench
  - src: ./images/gripper-manufacturing-2.jpg
    alt: Wired gripper assembly during manufacturing
  - src: ./images/stabilization-bracket.jpg
    alt: Custom stabilization bracket installed on hardware
  - src: ./images/bracket-feet.jpg
    alt: Machined bracket feet
  - src: ./images/enable-switch-holder.jpg
    alt: Enable switch holder designed to solve a fit issue on the floor
---

From January to August 2026, I was a robotics engineering intern at 
<a href="https://contoro.com/" target="_blank" rel="noopener"><img src="/images/contoro-mark.png" alt="" class="org-mark" width="48" height="48" />Contoro Robotics</a>, an Austin startup building robots that
unload floor-loaded trailers and shipping containers. During my time there, we were in a late Series A startup, which meant we were ramping up production to prove our capabilities. One of my favorite experiences was traveling to customer sites, such as Amazon's warehouse in Stockton California, to help operate the robot to unload shipping containers and troubleshoot any hardware issues.

My job was primarily helping with documentation, building final assemblies, and creating retrofits for the field using Solidworks. I worked with electrical boxes, power and data conduits, motor-drivers assemblies, camera towers, etc. While I enjoyed getting my hands dirty with building small fixes and existing assemblies, I wanted to create my own project that would better aid the testing and manufacturing process. I proposed and then built an ssembly stand which eventually evolved to an end-of-line test stand for the end-effector, a vacuum gripper used to pick up boxes. 

## The Gripper Test Stand

Every gripper assembly needed to be checked against a known-good reference
before it went onto a robot: suction across the full cup array, pneumatic
actuation, and electrical integration. Without a standard way to do that, each
technician improvised a bench setup, which made results hard to compare and easy
to get wrong. The rest of this page is that stand — what it had to prove, how the
gripper is held, the hardware that drives it, the app that runs the sequence, and
the cart it all lives on.

### Defining What to Test

The first job was deciding what the test was for. This is a functionality check,
not a performance characterisation: every valve travels in both directions and
holds where it should, every suction zone pulls and keeps vacuum, and every
sensor powers up. It also had to run fast, because a check that takes an
afternoon does not get run.

The harder part was what counts as passing. The stand's vacuum pump is far
smaller than the one on a robot, so absolute numbers measured here do not
transfer. Rather than fixed thresholds, the limits are measured off a gripper
that is known good, and every limit is computed from those: a healthy vacuum of
**−87.5 kPa**, a healthy leak-down of **2 s**, then separate margins for the rig
itself (10%), the gripper (27%) and leak-down (20%). Taking drawdown and
leak-down data let me separate what the rig loses from what the gripper loses,
which is the whole reason a small pump can still give a trustworthy answer.
Per-zone results are reported but never fail a gripper — the combined test is
more sensitive than any single zone.

### Holding the Gripper — The Assembly Stand

![CAD of the cantilevered gripper assembly stand](./images/assembly-stand-cad.png)

Before any of that, the gripper has to be held. I designed this stand originally
to make assembly easier — the gripper needs to rotate so both faces are
reachable — and it turned out to be exactly what the test stand needed as well,
so it does both jobs.

That makes it a cantilever carrying an **18 kg** end effector on a **224 mm**
overhang, with the centre of mass **88 mm** off the shaft axis, so rotating it
also applies torque. I designed it as a shaft-and-pillow-block support: a 30 mm
S45C shaft riding two **UCP206** pillow block bearings at 100 mm spacing, with
set screws locking the shaft in either of its two positions.

I worked the statics by hand before committing to hardware. The load sits
outboard of both bearings, so the stand behaves as an overhanging beam — the
outer bearing takes an upward reaction while the inner one is pulled *down*,
which is the part that catches people out and the reason the inner bearing needs
real pull-out capacity rather than just a bolt through a bracket.

![Hand calculations for the gripper stand](./images/hand-calc-1.png)
![Second page of hand calculations](./images/hand-calc-2.png)

| Check | Result | Margin |
| --- | --- | --- |
| Outer bearing reaction | 702 N against an 11,300 N static rating | **16×** |
| Inner bearing pull-out | 526 N against the same rating | **21×** |
| Shaft, von Mises at the critical section | 20.6 MPa against 490 MPa yield | **24×** |
| Tip deflection | 0.17 mm against a 0.5 mm requirement | **within** |

![The gripper mounted on the assembly stand](./images/gripper-stand.jpg)

The margins look absurd, and that is the actual finding: **the shaft diameter is
set by the bearing bore, not by stress.** Stress alone would allow roughly a
15 mm shaft at a safety factor of 2. Once a standard pillow block is the right
answer for the rotating joint, its 30 mm bore dictates the shaft, and everything
downstream is overbuilt for free. Knowing which constraint is actually binding is
what let me stop optimizing and buy catalog parts.

### The Control Hardware

Everything the stand does runs through one **IFM AL1340 IO-Link master** with
four ports, each doing one job:

- **X01** — a **Festo VABX-A-P-EL** valve manifold, 16 solenoids, written at
  Modbus register 1101. This is what actuates the gripper.
- **X02** — an **IFM PV7604** pressure transducer on a tapped vacuum line, read
  at register 2002. This is the measurement the whole test rests on.
- **X03** — an SSR-40 DA relay on the master's pin-4 digital out, register 3100,
  switching the VP125 vacuum pump. The pump runs on its own 110 V circuit.
- **X04** — a Phoenix Y-splitter feeding two laser distance sensors, checked only
  for whether they power up.

Power comes off a 110 V outlet through a CJ-2406 AC/DC supply to 24 V, then an
M12 splitter feeding both the master's logic power and the Festo solenoids on a
dedicated line — the master's Class A ports cannot supply solenoid current, which
is the kind of thing you find out once and never forget. A laptop talks Modbus
TCP to the master over a USB-C to RJ45 adapter.

![Hardware map and register reference from the test app](./images/app-hardware-map.png)

### The Test App

I wrote the app that drives the sequence: a FastAPI service on the laptop talking
Modbus TCP to the master, with a browser console in front of it. The 16 solenoids
are mapped from Festo's labels (`vlv5P2`) to names that mean something
(`suction_zone_1a_right`), and the test steps live in a config file rather than in
code, so the sequence can be changed without a rewrite.

A full run is **22 steps**. Step one drives every valve to a safe rest state and
then holds, waiting for an operator to confirm the work area is clear — the next
step is the first one that moves an actuator. After that the steps are written
around how each valve actually behaves. The bistable valves get pulsed and
released, then confirmed to still hold position with no coil energised. The
linear shuttle is not self-holding, so its coil stays powered through the
confirmation, its brake is released first and re-engaged at rest, and its retract
coil is deliberately never driven — it returns under gravity. Writing those steps
is also what caught a discrepancy between the valve table I had been given and
the hardware: two of the shuttle's roles were reversed.

![The 22-step test console](./images/app-test-console.png)
![Test summary with the leak-down curve](./images/app-summary.png)

The summary is the part a technician actually reads: pass or fail, the leak-down
curve against its gates, and a measured result per step — extend travel at
340 ms, retract at 320 ms, the shuttle confirmed to return by gravity with the
brake re-engaged.

### The Stand Itself

![The end-of-line gripper test stand](./images/test-stand.jpg)

The stand is a rolling cart carrying all of it — master, power supply, vacuum
pump, manifolds, transducer and the gripper fixturing — so a complete gripper can
be powered up and cycled on demand. The cart is mobile on purpose: the stand goes
to the work rather than the work going to the stand.

![CAD assembly of the test stand](./images/test-stand-cad.png)

### Why It Mattered

![A misaligned gasket left the cover plate proud of its seam](./images/manufacturing-fault.jpg)

Gripper validation became a short, repeatable sequence with a pass/fail that
means the same thing every time, run by whoever is on the bench. That makes
manufacturing faster, but the more valuable half is what it catches. The photo
above is a cover plate that never pulled down flush because the gasket under it
was misaligned — a fraction of a millimetre of gap, invisible unless you are
looking straight down the seam, and enough to show up as a leak the moment the
stand draws vacuum. Faults like that used to reach a robot before anyone noticed.
