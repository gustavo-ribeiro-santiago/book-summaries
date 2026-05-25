# Chapter 9: Batch

## The Counterintuitive Power of Small Batches

A father and his two daughters compete to stuff 100 envelopes. The daughters fold all letters first, then stamp, then stuff — the intuitive "efficient" approach. The father does one complete envelope at a time. The father wins every time.

**Single-piece flow** — a batch size of one — beats large-batch production even though it *looks* less efficient, for a key reason: **quality problems are discovered immediately**. If an envelope is the wrong size, the large-batch approach doesn't reveal this until 100 letters are already folded. In single-piece flow, you find out on the first one.

## Toyota's Lesson for Startups

After World War II, Japanese automakers couldn't afford the giant machines needed for mass production. Forced to innovate, Taiichi Ohno and Shigeo Shingo developed the **Toyota Production System**, using smaller general-purpose machines in rapid changeover cycles. Small batches enabled:
- **More product diversity** — no need for identical products to hit economies of scale.
- **Faster quality detection** — the *andon cord* lets any worker stop the line the moment a defect appears.
- **Continuous improvement** — problems are fixed at their root, not papered over.

## Small Batches at IMVU

Instead of monthly or quarterly releases, IMVU shipped new features **one at a time**, dozens of times per day. Engineers and designers worked side by side. An automated immune system detected business problems (not just technical ones) — for example, if the checkout button accidentally disappeared, the system would detect a drop in purchases, roll back the change, and alert the team.

This is **continuous deployment**: a practice that remains controversial but allows IMVU to learn at a speed competitors cannot match.

## The Large-Batch Death Spiral

Large batches tend to grow. Rework causes delays; delays incentivize adding more features ("since we're delaying anyway..."); more features mean more complexity; more complexity means more rework. Eventually, a startup ends up with a massive, never-quite-shipped release — a "bet the company" launch that nobody dares cut. This is the **large-batch death spiral**, and it consumes companies at every stage.

## Pull, Don't Push

Lean manufacturing's **just-in-time production** solves inventory waste through *pull* signals: each step in the supply chain pulls only what it needs from the previous step. Startups have the equivalent problem in intangible WIP (work-in-progress): unvalidated features, unshipped code, untested hypotheses are all inventory sitting on the floor.

In the Lean Startup, the pull signal is a **hypothesis that needs testing**. Product development should be pulled by the experiments the startup needs to run, not pushed by feature roadmaps. Any work not in service of a hypothesis is waste.

## Small Batches Beyond Software

Physical product startups (like SGW Designworks using 3D CAD and CNC machining), education (School of One giving students daily personalized playlists), and clean tech (Alphabet Energy using silicon wafer infrastructure to prototype in six weeks) are all discovering the same truth: reducing batch size and cycle time enables faster learning in every industry.

## Key Takeaway

> "The ability to learn faster from customers is the essential competitive advantage that startups must possess."

The essential lesson is not to ship 50 times per day — it is to reduce batch size enough to get through the Build-Measure-Learn loop faster than the competition.
