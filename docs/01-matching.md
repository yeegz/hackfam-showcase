# Matching people for a team

Dating apps match on mutual attraction. Hackathon teams need the opposite of similarity: the frontend developer does not need a second frontend developer, they need a designer and someone for the backend. Joinlet's ranking is built around complementary roles, reciprocity and honesty about why a card is shown.

## Two scopes

- **Event pool.** Everyone who joined the pool for one upcoming event. This is the main surface: shared intent and a deadline make people reply.
- **Anyone.** Builders open to future teams, independent of any event. Mutual interest here creates a lasting connection you can invite to any later event. There is no distance or radius: city is only a small tie-break and a reason ("Same city"), never a filter on location.

## Hard filters

A card is never dealt if either person blocked the other, either profile is paused, restricted or being deleted, the person is under 18 (the product is adults only), the target was already passed or acted on, or the team is full. These rules are shared by both scopes and re-checked on every read, so a block made after a deck was cached still removes the card.

## The score

For the Anyone scope, each direction is scored separately:

```
F(x→y) = 0.30·role + 0.20·shared upcoming events + 0.15·timezone overlap
       + 0.10·shared themes + 0.10·experience fit + 0.10·recent activity + 0.05·proof of work
```

The final score is the **harmonic mean of both directions**, `2ab / (a + b)`, so a card ranks highly only when each person is a good fit for the other. A harmonic mean is zero if either side is zero, which stops the deck from filling with people who will never be interested back. A congestion factor then lowers people who already have many unanswered requests, so attention spreads instead of piling onto a few profiles.

The role term reads the viewer's "looking for" roles: 1.0 if the candidate's primary role is one of them, 0.75 for a secondary role, and lower values for roles the viewer already covers. Event pools use the same idea with the team's open slots: a team with frontend and backend filled, still needing design, scores a designer near 1.0 and another backend developer near 0.1.

## Re-ranking and budgets

- **Diversity:** no more than three consecutive cards of the same role.
- **Exploration:** a share of each deck goes to low-exposure and new profiles, which fixes cold start on both sides.
- **A daily budget:** 40 new cards per event per day (80 within 48 hours of the event), and a separate 40 for Anyone, resetting at 04:00 in the person's own time zone. The end state is honest ("You've seen everyone for today") and points to browsing teams or filters instead of recycling profiles.
- **Your turn:** if eight or more conversations have waited on you for more than a day, the deck pauses with "Reply to keep going". Incoming interest, team browsing and chats stay open.

## What the product refuses to do

- No desirability score, Elo or "hot or not" ranking of people. Apple's guidelines ban objectification, and it would be toxic for a builder network.
- No scores leave the server. Cards carry at most three reasons, each tied to a real contribution: "Fills your Design slot", "Both going to Lisbon Build Weekend", "Your days overlap by 6 hours".
- Passes and private feedback are never shown to anyone. A declined interest reads as "ended" to the sender, never "declined".
- Profile completeness does not boost ranking. Linking your work gives only a small lift (proof is 0.05 of the score); role, goals and timing matter far more.

## Race safety

Two people tapping Interested on each other in the same instant must produce exactly one match and one conversation. This is enforced in Postgres and proven by a concurrency test that fires both actions in parallel against a real database, alongside tests for retried messages and for two people taking a team's last slot at once.
