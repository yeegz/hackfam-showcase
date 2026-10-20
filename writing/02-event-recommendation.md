# Recommending events

The Events tab answers one question for each person: which upcoming events are worth your weekend. It is a ranking problem with two awkward properties. Events are short-lived and usually new, so there is little interaction history to learn from. And popularity feeds on itself, so a naive "most joined" list buries every small or first-time event.

This is the version 1 design. Every weight is a starting value to be refitted from real logs, and the spec says so.

## Hard filters first

Filters remove; they never down-weight. An event is a candidate only if its pool is open (published, adult or mixed audience, team sizes 2 to 6), it starts within the next 120 days, teams do not lock within 24 hours, registration has not closed, its languages overlap yours, and you have not joined, saved or hidden it. Online events must overlap your waking hours by at least four hours. In-person events must be in your country unless someone you know is going.

## Eight features, each between 0 and 1

| Feature | Weight | What it measures |
|---|---|---|
| Topical fit | 0.24 | The event's themes (detected from title, tracks and description) against themes you picked, themes implied by your skills, and themes of events you joined before, with decay |
| Timing | 0.16 | A lead-time curve: a plateau 7 to 45 days out for in-person events (3 to 30 for online), ramps on both sides. A real registration deadline in the next 10 days adds a small boost; a guessed one never does |
| Place | 0.14 | Same city, same country, or, for online events, whether the kickoff lands in your daytime and how much of it overlaps your waking hours |
| Social | 0.14 | People you know who are going, saturating: one crew member is about 0.49, three about 0.86 |
| Role demand | 0.10 | How much this pool needs your primary role: open team slots and people looking for it, against how many already offer it. First-timers get extra weight for beginner-friendly pools |
| Pool health | 0.10 | Pool size and open teams on a log scale that saturates at 200, with an **exposure floor** that keeps a decent new event mid-table until 300 people have seen it |
| Quality | 0.07 | Verified organiser, extraction confidence and data completeness |
| History | 0.05 | Your affinity for this format and organisers you have joined before |

A negative-feedback multiplier then applies: "Not for me" on a series, a theme or a city lowers similar events for a while, and so does a card you keep scrolling past.

## Re-ranking: diversity and exploration

The top 60 are re-ranked with maximal marginal relevance so a rail is not five editions of the same series. Hard caps hold in the first 20: at most one per series, two per organiser, never two adjacent from one organiser. If the first four are all in person (or all online), the fifth goes to the best of the other kind. Positions 4, 12 and 20 are reserved for exploration: drawn from eligible events outside the top 10 that few people have seen or that are new to you, seeded per person per day so the list stays stable within a day.

## Explanations, never scores

Each card carries at most two reasons, and a reason appears only if its feature actually contributed: "Aisha is going", "12 teams need Design", "You picked Climate", "Runs 18:00 to 23:00 your time". The client never receives a score or a weight. Some phrasings are banned outright: "Popular", "Trending", "Selling fast", "{n} people viewed", or "Recommended" without a reason.

## Privacy thresholds

- A builder count is shown only when it is at least 10; below that the card says "New pool".
- Role demand appears only when the pool has 20 or more builders and that role has 5 or more open teams.
- Inside the ranking, role demand is computed only for pools of at least 10, so rank shifts cannot leak the make-up of a tiny pool.
- People you know are named only for mutual ties, and never if they are hidden, blocked, paused or deleting.

## Anti-gaming

Organisers cannot pay for rank, and no function sets a boost. Pool counts exclude accounts under 72 hours old, unfinished profiles and the event's own organisers. A spike detector freezes an event's features and displayed count when joins jump far above its baseline from mostly new accounts. Keyword stuffing is capped (three themes, a description read at half weight), and completeness is worth at most 0.021 of a score.

## Worked example

A designer in Kuala Lumpur who picked AI and Climate, one hackathon of experience:

| Event | Score | Why |
|---|---|---|
| Global AI agents hackathon, online, 10 days out, 420 builders, a connection going | 0.821 | Social and pool health; "Aisha is going", "12 teams need Design" |
| Climate buildathon in Kuala Lumpur, 20 days out, 45 builders | 0.734 | Design is scarce there; "5 teams need Design", "You picked Climate" |
| Small hack night in Kuala Lumpur, 5 days out, 3 builders | 0.531 | Reaches the list through the exposure floor |

## Evaluation

Offline: time-based replay, tuning on earlier weeks and testing on the next, measuring NDCG@10, join rate, coverage (every eligible event seen by at least 100 eligible people within 72 hours of publication) and novelty. Online: A/B tests on join rate and team-formed rate, never on time in app.
