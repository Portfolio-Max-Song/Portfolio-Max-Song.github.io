---
title: The Macropad
date: '2024'
order: 8
blurb: >-
  A hand-wired Pico macropad with SLA keycaps, built for a TIW new-hire
  competition.
description: >-
  A custom macropad Max Song designed for a Texas Inventionworks new-hire
  competition — a PETG switch plate, SLA printed keycaps, and a hand-wired
  Raspberry Pi Pico with a USB-C adapter.
skills:
  - Fusion 360 (Parametric Modeling)
  - FDM & SLA Printing (PETG, Resin)
  - Design for 3D Printing (Press Fits, Tolerances)
  - Raspberry Pi Pico
  - Electronics Integration (Hand-Wired Switches)
hero: ./images/macropad-main-1.jpg
heroAlt: The finished macropad on a desk
---

<p class="text-full">As a new hire at <a href="https://inventionworks.engr.utexas.edu/" target="_blank" rel="noopener"><span class="org-mark is-tiw" aria-hidden="true"></span>Texas Inventionworks</a>, I was tasked with creating a macropad that could pass two typing tests, one with a predetermined string and one with a surprise string, and compete for the most attractive design. I was extremely excited to start since I had already planned on making a macropad for myself and had sketches ready, which sped up the design process and pushed me to make something I would actually want on my own desk.</p>

![The finished macropad on a desk](./images/macropad-main-1.jpg "full")
![The macropad from the front, showing the USB-C port](./images/macropad-main-2-crop.jpg)

<p class="caption caption-sm">The finished macropad, front view</p>

<p class="caption caption-sm">The finished macropad, back view with the USB-C port</p>

<h3 class="text-centered">Design Process</h3>

![The macropad's parts in Fusion 360](./images/macropad-cad.jpg "right")

<p class="caption caption-sm">The plate, keycaps, and body in Fusion 360</p>

We had one month with a progress check halfway through, and my personal goal was to finish the CAD and electronics early so I could spend the rest of the time on aesthetics. This meant iterating through the designs quickly.

I wanted to make something that looked a bit different from what was on the market, with the smallest footprint I could manage and an almost floating effect for the keys. We were given a Raspberry Pi Pico, but I didn't like the idea of a Micro-USB input, so I first designed extra room in the CAD for a Micro-USB to USB-C adapter, which I bought for about a dollar on AliExpress.

For manufacturing, I wanted the plate the switches sit in to be made from PETG so it would be slightly elastic. I also added a small slot so the switches snapped cleanly into place, which made soldering them easier. Each key was SLA printed to capture the geometry on top, where I extruded two parabolas through the top and added a fillet to smooth it out and make it comfortable to press.

![Hand-wired switches and the Raspberry Pi Pico](./images/macropad-wiring-crop.jpg "left-70")

<p class="caption caption-sm">Hand-wiring the switches to the Pico</p>

The hardest part of this project was soldering the switches. I had soldered in the past, but the plate had some messy tolerancing due to the inaccuracy of the FDM printer. In addition, it was hard to keep the Pico from moving due to the awkward position. But after an hour, I had it all wired up.

<p class="text-full">For the competition, we were surprised with a second part: an audience favorite competition. I had overlooked how much people enjoy uniqueness, which led me to lose to more unusual designs despite making something that was probably more practical. If I had another chance at this project, I would spend more time on the manufacturing of the body, and incorporate more unique colors which could have captivated the audience better. However, during the typing contest, I had hardcoded the string into a key which allowed me to win the competition.</p>
