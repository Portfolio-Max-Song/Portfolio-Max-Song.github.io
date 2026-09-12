---
title: Personal Projects
order: 9
blurb: >-
  Smaller projects I work on in my spare time — a phone case, a desk lamp, and a
  shoe rack. These are where I experiment with new skills and materials without a
  deadline attached.
description: >-
  Personal design projects — a multi-material iPhone case, a desk lamp with
  reusable electronics, and a dowel-and-3D-print shoe rack built for $9.09.
skills:
  - Iterative Design
  - Material Selection
  - Electronics Integration
  - Cost Analysis
hero: ./images/phone-case.jpg
heroAlt: 3D printed iPhone case with TPU corner inserts
gallery:
  - src: ./images/overview.jpg
    alt: A selection of personal projects
  - src: ./images/phone-case.jpg
    alt: Finished phone case on the phone
  - src: ./images/lamp-cad-1.jpg
    alt: Desk lamp CAD model
  - src: ./images/shoe-rack.jpg
    alt: Assembled dowel-and-connector shoe rack
---

These are personal-use projects with a much smaller scope — currently a phone
case, a lamp, and a shoe rack. They're where I try things without a deadline. I
use Fusion 360 for most of them and print on a Bambu A1 I bought with the money
from my freshman summer internship. Going forward I want to design more everyday
objects and push harder on unfamiliar shapes, materials, and styles.

## Phone Case

![Phone case CAD](./images/phone-case-cad.jpg)

**The problem:** design a case that shows off the iPhone rather than hiding it,
using far less material, without giving up protection. And design a MagSafe
wallet using 3D printed parts, magnets, and leather.

**Approach:** I studied the heavy-duty cases from Mous and Spigen and worked
backwards, stripping them down. I went through Pinterest and Instagram carefully,
partly to confirm nobody had already made what I was picturing and partly to
sanity-check that it would work at all. I wanted the case to print in one piece
and snap on for a snug fit. The design uses interconnected PLA bumpers with TPU
inserts to absorb impact — PLA deliberately, so that in the worst case the case
cracks instead of the phone.

**Outcome:** I dropped it several times and the phone never cracked. (The screen
protector did, but that can happen inside a full case too.) It reads as a bumper
case but still follows the flow of the iPhone, which is what I was after. My only
real regret is not finishing the wallet in time to carry it on my trip.

![MagSafe wallet CAD](./images/wallet-cad.jpg)

**What I'd change:** the sides were thin, because a MagSafe wallet or charger
still had to seat on the back, and one snapped when it caught on my pocket. The
second iteration adds double railing on the sides, which also protects the front
of the screen. The original TPU corner bumpers never made it into the carried
version — without an enclosed printer the TPU prints failed consistently. I'm
looking at SLA or SLS at Texas Inventionworks for the next one. For the wallet, I
want spring steel sheets; the PETG I printed doesn't hold enough pressure on the
cards to make removal clean.

## Lamp

![Lamp CAD](./images/lamp-cad-1.jpg)

**The problem:** my LED desk lamp worked well until the plastic base cracked from
being bent too far. I wanted to keep the adjustable light, add color temperature
control, and design and build every part except the electronics myself.

The real goal was broader: build a lamp whose electronics are easily replicable,
so the same package can drop into future projects — a light bar for the top of my
monitor, a reading bar above my bed. That means a small form factor with easy
adjustability.

**Approach:** I wanted something close to my old lamp but without moving parts,
since that's exactly what failed. The design went through several iterations, but
I deliberately spent more time on the electronics than the shell.

![Lamp electronics layout](./images/lamp-cad-2.jpg)

**Progress:** this project has taught me most of what I know about integrating
electronics into a print. My first iteration put the batteries in series and used
two buck converters — two because the LED strip wants 12 V and the microcontroller
wants 5 V. That was an inefficient use of power and the current was too low to
keep up. The second iteration puts the batteries in parallel and uses two voltage
boosters, which are also far smaller than the buck converters. Right now I'm
working on making the lamp structurally sound despite printing in multiple parts.

## Shoe Rack

![Shoe rack CAD](./images/shoe-rack-cad.jpg)

**The problem:** after a few months in an apartment I had a pile of shoes outside
my door. I wanted a rack with no screws or adhesive, modifiable dimensions, easy
assembly and disassembly for moving, built from materials I already had — and
above all, cheaper than buying one.

I took it up during finals week as a break from studying, aiming to finish before
I left for break.

**Approach:** in middle and high school I did Odyssey of the Mind, which involved
building skit props, often out of PVC. I had bulk birch dowels left over from Song
Leather, and realized I only needed to design the connectors to hit every one of
my goals — and that 3D printing them would make it cheap. For the look, I wanted
the hybrid of woodworking and 3D printing to be the point, so white connectors
against light birch.

![Assembled shoe rack](./images/shoe-rack.jpg)

**Outcome:** the dowels were uneven, so the tolerances had to leave room without
needing epoxy or CA glue. I printed at 10% infill but with 3 wall loops for
press-fit strength. The print used about 450 g of PLA at $8.99/kg bulk from
Kingroon — $4.05. Checking my old order, 25 dowels cost $21, so $0.84 each; the
4-foot rack takes 6, or $5.04.

**Total: $9.09.** Comparable racks on Amazon average around $23, and those are
metal. I'll call that a success.

**What I'd change:** a finishing oil on the dowels would help the tolerances,
since the wood expands as it absorbs oil. I'd also add a hole through the
connectors so the rack can be screwed down if I ever land somewhere permanent —
and screwing into the wood would let it expand into a better fit.
