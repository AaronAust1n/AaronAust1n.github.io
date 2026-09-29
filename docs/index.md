---
layout: home
title: AaronAust1n
titleTemplate: Cyber Junkyard
description: "A personal blog and an interactive museum of visual experiments. Notes on accelerationism, flowing glass, and the trends behind digital space."

hero:
  name: AaronAust1n
  text: Cyber Junkyard
  tagline: Obsessed with grand narratives, expert at missing the point, never grounded.
  actions:
    - theme: brand
      text: Read the Blog
      link: /posts/
    - theme: alt
      text: Enter the Museum
      link: /museum/
      target: _self
    - theme: alt
      text: Cast a Vote
      link: /vote

features:
  - title: Accelerationism
    details: Understand reality, break constraints. Notes on technology, capital and speed.
  - title: Flowing Glass
    details: The trends behind digital space, written down before they harden into dogma.
  - title: Interactive
    details: Hands-on exhibits and community polls, all running locally in your browser.
---

<MuseumShowcase />

<div class="ol-section-label">LATEST WRITING</div>

<HomeLatest />

<div class="ol-section-label">FEATURED POLL</div>

<div class="ol-poll">
  <VoteCard
    question="What should be the next topic?"
    :options="['Tech Tutorials', 'Design Thoughts', 'Life Stories', 'Coding Tips']"
  />
</div>