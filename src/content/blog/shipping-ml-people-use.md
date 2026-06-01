---
title: "From Models to Movements: Shipping ML People Actually Use"
description: "Lessons from a decade of putting machine learning in front of hundreds of millions of people — why the hardest part of ML isn't the model, it's everything around it."
publishedAt: 2026-06-01
tags: ["AI/ML", "Engineering Leadership", "Product"]
draft: false
---

The most common mistake I see in applied machine learning is treating the model as the product. It almost never is. The model is one component inside a system that has to earn trust, ship reliably, and change someone's behavior for the better. After a decade building ML systems that touch hundreds of millions of people, here is what I've learned about the distance between a good model and a result people actually feel.

## The model is the easy part

Modern tooling has made training a strong baseline model genuinely accessible. What separates a demo from a product is everything that surrounds it: the data pipelines that feed it, the evaluation harness that tells you whether it's getting better, the serving layer that keeps it fast, and the feedback loop that lets it improve in production.

When I led personalization at Spotify, the breakthroughs that moved the needle were rarely a new architecture. They came from tightening the loop between what we shipped and what we learned — better logging, faster experiments, and a ranking stack that let us iterate in days instead of quarters.

## Optimize for the loop, not the launch

A single launch is a snapshot. A learning loop is a movie. The teams that win are the ones that can run many small, safe experiments and compound the gains.

- **Instrument first.** If you can't measure the behavior you care about, you can't improve it. Logging is not glamorous, but it is the foundation everything else stands on.
- **Make experiments cheap.** The cost of running an A/B test is a tax on learning. Drive that cost toward zero and your iteration speed takes care of itself.
- **Close the loop end to end.** Signal ingestion, training, serving, and measurement should be owned as one system, not handed across team boundaries.

## Trust is a feature

Recommendations only matter if people believe them. A system that's right 95% of the time but confidently wrong in visible ways will lose users faster than one that's slightly less accurate but rarely embarrassing.

This is why I treat reliability, latency, and graceful failure as product features, not infrastructure afterthoughts. The goal isn't a higher offline metric — it's a person who comes back tomorrow because the experience respected their time and intelligence.

## Build for amplification

The ML systems I'm proudest of share one trait: they made people more capable. They helped a listener discover music they'd never have found, gave a small seller global reach, or surfaced an answer that would have taken hours to dig up.

That's the bar I hold for any system worth shipping. Not "did the metric go up," but "did a real person walk away more capable than before." Get that right, and the metrics follow.

---

*This is the first post in an ongoing series on building AI systems that matter. More to come.*
