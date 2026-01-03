# 🏝️ Koh JS: The Island of Stability
**Forget the Virtual DOM. Embrace the Closure.**

Koh JS is a high-performance, reactive UI framework designed for the Island Architecture. It is built for developers who are tired of fighting re-renders, stale closures, and the overhead of modern "black-box" frameworks.

> "Koh doesn't synchronize your data with the DOM. It physically glues them together."

---

## 🏗️ The Koh Factory: Native Encapsulation

Every Koh component is born from a Factory Method. This isn't just a function return; it's the birth of a Native Custom Element.

Inside the factory, your code runs EXACTLY once per instance. No re-renders. Ever.

### Why the Factory wins:
- Physical Boundaries: Every island is a real Web Component. No CSS leaks, no global scope pollution, just clean encapsulation.
- Zero-Overhead Lifecycle: Leveraging the browser-native connectedCallback. Koh knows exactly when an island enters or leaves the DOM without a complex internal scheduler.
- Persistent State: State defined in the factory is physically linked to that specific HTML node. It stays alive as long as the element exists.

---

## 🚀 Why Koh?

Most frameworks guess what changed by diffing trees. Koh knows because it never loses the reference.

- ⚡ 4ms Reactive Pulse: Updates hit the exact text node or attribute in microseconds.
- 🧠 Bulletproof Closures: Elements "remember" their birth-context. Sorting or moving elements never breaks their reactive links.
- 🔗 Deep Reactive Signals: State proxies that automatically track nested objects and arrays.
- 🛡️ Legacy Bridge: Specialized hydrate() logic to extract data from x-magento-init scripts and instantly transform them into reactive islands.

---

## 🛠️ The Core Philosophy

### 1. Physical Memory Identity
When you render a list with k.for, Koh creates a Map between your objects and your DOM nodes. When you sort the data, Koh doesn't re-render; it physically moves the DOM nodes. The internal state (like focus or scroll position) is preserved because the element is never destroyed.

### 2. "It Can't Be Otherwise" Reactivity
Computeds in Koh are deterministic. If your formula accesses a property, it is subscribed. Forever. In a cart total, Koh tracks the list AND every individual price signal accessed inside automatically.

---

## 🎯 Challenges for the Brave

1. The Sorting Test: Sort a list of 5,000 items by name, then by price. Watch the DOM nodes shuffle instantly in the inspector without a single "re-render" cycle.
2. The Closure Lock: Attach an event listener inside a k.for. Sort the list until your item is at the bottom. Click it. It still points to the exact object it was born with.
3. The Legacy Bridge: Use Koh to bridge the gap between a 10MB PHP-generated page and a lightning-fast reactive cart.

---

## 📜 Installation
If you're still looking for a package.json, you're not ready for the island yet.
