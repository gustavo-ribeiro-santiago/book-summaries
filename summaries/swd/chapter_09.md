### **Core idea:**

**Real-world data visualization challenges rarely fit neatly into the lessons as stated — this chapter applies the principles to five common scenarios where designers regularly get stuck: dark backgrounds, live vs. circulated visuals, categorical ordering, spaghetti graphs, and pie chart alternatives.**

Put simply: **knowing the rules is not enough — seeing them applied to tricky, real-world situations builds the practical judgment to handle the unexpected.**

---

### **Case Study 1: Color on a dark background**

White backgrounds are standard recommendation because dark backgrounds pull the eye to the background instead of the data. But brand constraints sometimes override this preference.

When working with a dark background, the rules invert: instead of dark standing out against light, *light stands out against dark*. White becomes your most attention-grabbing color. Yellow — normally useless on white — becomes incredibly powerful against black. Grey (which de-emphasizes against white) still de-emphasizes against dark, but occupies a different position on the scale.

**Key lesson**: color rules are always relative to the background. When the background changes, recalibrate which colors attract attention and which recede.

---

### **Case Study 2: Animation for live vs. circulated visuals**

The classic tension: a presentation deck should be sparse (you're there to explain); a circulated document must stand alone (all context must be in the content). The "slideument" — trying to be both — usually fails at both.

**Solution using animation**: In a live presentation, build the visual progressively using animation — start with blank axes, then reveal data points and annotations one by one as you narrate each point. The audience cannot jump ahead; their attention is where yours is. For the circulated version, put the complete annotated final state (all annotations, all labels, full context) on top — when the deck is printed or exported, only this final frame appears.

This requires knowing your narrative without relying on the slides as a teleprompter, but produces a single deck that genuinely serves both the live and circulated needs.

---

### **Case Study 3: Logic in order — categorical data**

Survey data showing feature satisfaction (percentage "Completely satisfied," "Very satisfied," "Neutral," "Not satisfied," "Have not used") can tell three different stories depending on which data is emphasized and how the categories are ordered:

- **Highlight satisfaction**: Order categories by descending "Completely + Very Satisfied"; color those segments.
- **Highlight dissatisfaction**: Order by descending "Not satisfied"; color those segments.
- **Highlight unused features**: Order by descending "Have not used"; color those segments.

**For a live presentation telling all three stories**: establish a base visual with consistent category order, then progressively highlight each story one at a time — never rearranging the data between slides. Rearranging between views creates cognitive burden (the audience must re-learn the layout). Maintain the same order; change only what is colored and what the callout text says.

**For a written document**: a single comprehensive visual with three distinct color schemes and callout text boxes can convey all three stories simultaneously — the density works because the audience can read at their own pace.

**Rule**: Always establish logic in how you order categories. Order carries meaning — it tells the audience what to compare first.

---

### **Case Study 4: The spaghetti graph**

A spaghetti graph is a line graph where multiple lines overlap so much that no single series can be followed. It looks like its name and is about as informative.

**Three strategies**:

1. **Emphasize one line at a time**: Push all other lines to grey; bring one line forward in color with a data marker and label. Use this technique sequentially in a live presentation — familiarize the audience with the data once, then cycle through each series. Requires a narrative to explain why each highlighted series matters.

2. **Separate spatially — vertically**: Create small individual graphs, one per category, sharing the same x-axis across all. Emphasizes trend within each category; allows comparison across categories at a given time point (but requires careful axis consistency — all graphs must use the same y-axis scale, or comparisons are invalid).

3. **Separate spatially — horizontally (small multiples)**: Create individual graphs sharing the same y-axis. Emphasizes relative magnitude across categories. Same axis consistency requirement.

4. **Combined approach**: Separate spatially *and* emphasize a single series — the other series in each small graph are grey context, while one is colored. Best for reports rather than live presentations.

---

### **Case Study 5: Alternatives to pie charts**

Pie charts ask the audience to compare angles and areas — humans do this poorly. For survey data showing "How do students feel about science?" (before and after a learning program), four alternatives:

1. **Show the numbers directly**: If the story is "positive sentiment increased from X% to Y%," just show those two numbers prominently with a sentence. The simplest option and often the most powerful.

2. **Simple bar chart**: Before/After as the primary grouping, with paired bars for each sentiment category. Common baseline makes comparison easy. Allows callout boxes adjacent to specific data points.

3. **100% stacked horizontal bar**: Preserves the part-to-whole concept. Consistent baseline at both left and right allows comparison of negative-end categories (left baseline) and positive-end categories (right baseline) simultaneously. Good for Likert-scale survey data.

4. **Slopegraph**: Shows each category as a line from Before to After. Steep slopes = large changes. Ordering of categories is determined by data values, not designer choice — useful when the natural ordering by value is the story, problematic when ordinal ordering is needed.

**No single alternative is universally "best"** — the choice depends on what you want your audience to be able to do with the data.

---

### **The chapter's principle**

> When you face a data visualization challenge you're unsure how to solve, the near-universal advice is: pause and consider your audience. What do you need them to know or do? What story do you aim to tell? The answers almost always point to a path forward.

---

### **Bottom line**

If you want to:

- **Handle the common hard cases**

Then:

- **Spaghetti graph**: separate spatially, or emphasize one line at a time with all others in grey.
- **Pie chart**: replace with simple bar chart, 100% stacked horizontal bar, slopegraph, or — when the story is one or two numbers — show just those numbers directly.
- **Categorical ordering**: always tell the audience what the order means by making it reflect the story you want to tell; never rearrange between views in a presentation.

**"The responsibility — and the opportunity — to tell a story with data is yours."**
