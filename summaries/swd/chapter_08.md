### **Core idea:**

**The six lessons of storytelling with data are not independent techniques — they work as an integrated, sequential process. This chapter demonstrates the complete workflow from context through visual choice, clutter elimination, attention direction, design refinement, and story construction using a single real-world example.**

Put simply: **seeing the full process applied end-to-end on one dataset is worth more than any number of isolated lessons — this is the chapter where everything connects.**

---

### **The central principle**

The storytelling with data process is:
1. Understand the context
2. Choose an appropriate visual display
3. Eliminate clutter
4. Draw attention where you want your audience to focus
5. Think like a designer
6. Tell a story

Each step builds on the previous one, and the whole is greater than the sum of its parts. A well-chosen chart with clutter still in it is less effective than an imperfect chart that has been decluttered and focused.

---

### **Step 1: Understand the context first**

The starting point is never "how should I visualize this?" It is: "Who is my audience? What do I need them to know or do? What data will support that?" In this example:

- **Who**: VP of Product, the primary pricing decision maker
- **What**: Understand how competitors' pricing has changed over time → recommend a price range
- **How**: Average retail price over time for five competitive products
- **Big Idea**: "Based on market pricing analysis, to be competitive, we recommend introducing our product at a retail price in range $X–$Y."

Without this clarity, any visualization is guessing.

---

### **Step 2: Try multiple visual forms before committing**

The original visual — a bar chart with color-coded bars by product per year — forces the eye to work hard reading individual bars. Multiple iterations are tried:

- Remove color variation across bars (removes distraction, not enough)
- Highlight 2010-forward data to match the intended headline
- Switch from bar chart to line graph — the lines show continuous change over time more naturally than bars and eliminate the artificial staircase effect of discrete bars
- Consolidate multiple line graphs into a single graph (one x-axis, all products)

The progression shows that the "right" visualization isn't always obvious — it requires deliberate exploration.

---

### **Step 3: Eliminate clutter from the graph's default state**

Charting tools apply defaults that are almost universally wrong for effective communication. Changes made:
- De-emphasize the chart title (not bold)
- Remove chart border and gridlines
- Push x- and y-axis lines and labels to grey
- Remove color variation between lines (replaced with intentional color later)
- Label lines directly (eliminate legend)

The result: the data stands out because it's the only thing with visual weight.

---

### **Step 4: Use preattentive attributes to tell different aspects of the story**

With the decluttered graph, the same visual can direct the audience to different things by changing which elements are colored and what text is present:

- **Focus 1**: "After the launch of Product C in 2010, the average retail price of existing products declined" — color the relevant line segments blue, add a data marker at the 2010 launch point
- **Focus 2**: "With the launch of a new product in this space, it is typical to see an initial price increase followed by a decline" — shift the coloring to show the new product price trajectory
- **Focus 3**: "As of 2014, retail prices have converged, with an average of $223" — highlight convergence points with data markers and labels

The same base visual tells multiple aspects of the same story by changing only what is emphasized.

---

### **Step 5: Add the designer touches that make it accessible**

Even a well-chosen, decluttered, focused chart can fail if the text doesn't do its job:
- Simplify the graph title language; capitalize only the first word
- Add axis titles to both vertical and horizontal axes
- Upper-left-align the graph title (not centered floating in space)
- Align axis titles to the uppermost and leftmost labels respectively

These changes ensure the audience knows how to read the graph before they encounter the data.

---

### **Step 6: Structure the story for live presentation**

With 5 minutes and a live audience, the story is told as a progression of the same base visual, each slide revealing or emphasizing only the part of the data being discussed at that moment:

1. Set up the graph (show only the axes and structure)
2. Introduce each product's price history chronologically
3. Introduce the competitive tension as new lower-priced products enter
4. Show how prices converge over time
5. End with the clear call to action: the recommended price range for the new product

By the time the recommendation appears, the audience has been walked through the evidence that supports it. They experienced the story, not just the conclusion.

---

### **Before and after**

The original visual — a multi-color bar chart showing all five products over all years — shows data. The final version — a line graph, decluttered, focused with strategic color, properly titled, used as a sequence of slides — tells a story.

---

### **The chapter's principle**

> The communication step is the only part of the entire analytical process that your audience sees. Every other step — collecting data, cleaning it, analyzing it, building models — is invisible to them. This step deserves proportionate investment.

---

### **Bottom line**

If you want to:

- **See how the entire process works in practice**

Then:

- **Follow the sequence**: context first → visual choice → declutter → focus → design → story. Don't skip steps, and don't linearize the process — iteration is normal and expected.

If you want to:

- **Turn a single base visual into a rich narrative**

Then:

- **Use the same decluttered graph multiple times**, changing only what is colored and what text accompanies it. This trains the audience on the data once, then uses that familiarity to progressively tell deeper parts of the story.

**"By drawing our audience's attention to the specific part of the story we want to focus on… we've led our audience through the story."**
