# 🏝️ Koh JS: The Island of Stability
**Forget the Virtual DOM. Embrace the Closure.**

Koh JS is not your replacement for React or Vue. It is another way of thinking altogether. 
It is a surgical, `high-performance` reactive UI engine `specifically designed` for the **Island Architecture**. While others build monolithic trees, Koh builds independent, bulletproof islands that live and breathe inside any environment—from legacy and modern Magento stores to static sites.

> "Koh doesn't synchronize your data with the DOM. It physically glues them together."

---

## 🏗️ The Koh Factory: Built to Last

Every Koh component is born from a **Factory Method**. This isn't just a function; it's the birth of a **Native Custom Element**.

```javascript
export const MyComponent = koh((k, props) => { 
    // This body runs EXACTLY once per instance.
    // No re-renders. Ever.
})
```

Inside the factory, your code runs **EXACTLY once**. No magic re-renders that reset your variables or break your logic. What you define at the start stays alive as long as the component exists.

### Why this is a game-changer:
- **Total DOM Control:** You have direct, unfiltered access to the real DOM nodes. No more fighting with refs or "the React way" of doing things.
- **Physical Boundaries:** Every island is a real Web Component. It’s protected from the outside world, preventing CSS leaks and global scope pollution.
- **Zero-Overhead:** Koh uses the browser's native `connectedCallback`. It knows exactly when an island is active without a heavy background engine.

---

## ✍️ The DSL: Write Less, Do More

Koh uses a pure JavaScript syntax that feels like writing HTML, but with superpowers. No JSX, no Babel, no complex build steps.
Unlimited nesting of dom element factories. 

- **Direct Binding:** Use `k.watch` to link your data directly to a DOM attribute. When the data changes, the attribute updates instantly.
- **Smart Lists:** With `k.for`, your data objects are literally anchored to HTML elements. If you sort your list, Koh physically moves the elements in the browser instead of destroying and recreating them.
- **Native Power:** Because it's just JS, you can use any native browser API (like IntersectionObserver or Web Animations) directly inside your component without layers of abstraction.

*This is what it looks like:*

```javascript
    k.html(
        k.dom.h1(k.watch(cartTotals, value => `Totals: ${value}`)),
        k.dom.div(
            el => {
                el.className = 'flex flex-col'
            },
            k.dom.button('Add item', el => {
                el.onclick = () => {
                    cart.items(prev => [...prev, { name: 'Cart item', price: 49.99, amount: 1 }])
                }
            }),
            ......
            ```

---

## ⚙️ How It Works: The Mechanical Advantage

Koh JS operates on a few simple, unbreakable laws of JavaScript:

- **Reference Anchoring:** Instead of re-creating HTML from templates, Koh maps your data objects directly to persistent DOM nodes using a `Map`. When the data moves, the node moves.
- **Dependency Tracking:** When you access a signal within a computed or a watcher, Koh automatically creates a subscription. There is no manual "dependency array"—if you use it, it’s tracked.
- **Granular Hydration:** Koh can "wake up" existing DOM structures or inject new ones without disturbing the surrounding environment. It only hydrates the "islands" that need to be alive.

---

## 🚀 Why Koh?

Most frameworks guess what changed by diffing trees. Koh knows because it never loses the reference.

- ⚡ 4ms Reactive Pulse: Updates hit the exact text node or attribute in microseconds.
- 🧠 Bulletproof Closures: Elements "remember" their birth-context. Sorting or moving elements never breaks their reactive links.
- 🔗 Deep Reactive Signals: State proxies that `automatically` track nested objects and arrays.
- 🛡️ Legacy Bridge: Specialized `hydrate()` logic to extract data from x-magento-init scripts and instantly transform them into reactive islands.

---

## 🛠️ The Core Philosophy

### 1. Physical Memory Identity
When you render a list with k.for, Koh creates a Map between your objects and your DOM nodes. When you sort the data, Koh `doesn't re-render`; it physically moves the DOM nodes. The internal state (like focus or scroll position) is preserved because the element is never destroyed.

### 2. "It Can't Be Otherwise" Reactivity
Computeds in Koh are deterministic. If your formula accesses a property, it is subscribed. Forever.

```javascript
const cartTotals = k.compute(() => {
    // Koh tracks the list AND every individual price signal accessed inside.
    return cart.items().reduce((p, c) => p + c.price() * c.amount(), 0);
});
```

---

## 🎯 Challenges for the Brave

1. The Sorting Test: Sort a list of 5,000 items by name, then by price. Watch the DOM nodes shuffle instantly in the inspector without a single "re-render" cycle.
2. The Closure Lock: Attach an event listener inside a k.for. Sort the list until your item is at the bottom. Click it. It still points to the exact object it was born with.
3. The Legacy Bridge: Use Koh to bridge the gap between a 10MB PHP-generated page and a lightning-fast reactive cart.

---

## 📜 Installation
If you're still looking for a package.json, you're not ready for the island yet.
