import { tags } from './koh-tags'
import { kohSignal } from './koh-signal'

class KohComponent extends HTMLElement {
    mutObserver = undefined
    dom = {}
    unsubscribes = []
    _initialized = false
    _needCleanup = new WeakMap()
    constructor() {
        super()
        Object.entries(tags).forEach(([key, fn]) => {
            this.dom[key] = fn.bind(this)
        })
    }
    // Lifecycle
    init(kohFunc, props, childs) {
        this.kohCreateFunc = kohFunc
        this.props = props
        this.childs = childs
        return this
    }

    checkCleanup(node) {
        if (this._needCleanup.has(node)) {
            this._needCleanup.get(node)?.()
            this._needCleanup.delete(node)
        }
    }

    cleanup(mutationList) {
        // Relax and wait until definite removals:
        queueMicrotask(() => {
            if (this.isConnected) {
                return
            }
            for (const mutation of mutationList) {
                for (const el of mutation.removedNodes) {
                    this.checkCleanup(el)
                    const children = el?.querySelectorAll('*')
                    if (children) {
                        children?.forEach(childNode => this.checkCleanup(childNode))
                    }
                }
            }
        })
    }

    connectedCallback() {
        if (this._initialized) return
        this._initialized = true
        if (this.kohCreateFunc) {
            this.kohCreateFunc(this, this.props, this.childs)
            this.mutObserver = new MutationObserver(this.cleanup.bind(this))
            this.mutObserver.observe(this, { childList: true, subtree: true })
        }
    }
    disconnectedCallback() {
        // Wait for the real teardown:
        queueMicrotask(() => {
            if (!this.isConnected) {
                this.mutObserver.disconnect()
                this.unsubscribes.forEach(unsub => unsub())
                this.unsubscribes = []
                this._initialized = false // Make sure to enable a 'restart'
            }
        })
    }

    // State & signals
    state(initialState) {
        return kohSignal(initialState)
    }

    watch(signalRef, subscriber) {
        return root => {
            const runner = () => {
                subscriber(root, signalRef())
            }
            kohSignal._currentSubscriber = runner
            // 'Register' the signal and subscriber
            runner()
            kohSignal._currentSubscriber = null
            const unsubscribe = () => signalRef.unsubscribe(runner)
            this._needCleanup.set(root, unsubscribe)
        }
    }

    compute(currentRunner) {
        const resultSignal = kohSignal()
        const runnerWithUpdate = () => {
            const value = currentRunner()
            resultSignal(value)
        }

        kohSignal._currentSubscriber = runnerWithUpdate
        // 'Register' the signal(s) and subscriber (the new signal)
        runnerWithUpdate()
        kohSignal._currentSubscriber = null

        return resultSignal
    }

    // Dom:
    html(...elementFactories) {
        elementFactories.map(elementFactory => {
            elementFactory(this)
        })
    }

    for(signalRef, renderFunc) {
        const elementMap = new Map()

        const update = (root, items) => {
            const itemSet = new Set(items) // Quick lookup
            // Remove old items?
            for (const [itemSignal, element] of elementMap.entries()) {
                if (!itemSet.has(itemSignal)) {
                    element.remove()
                    elementMap.delete(itemSignal)
                }
            }
            items.forEach((item, idx) => {
                if (!elementMap.has(item)) {
                    const domElement = renderFunc(item, idx)(root)
                    elementMap.set(item, domElement)
                } else {
                    // Sorted or no updates:
                    const domElement = elementMap.get(item)
                    root.appendChild(domElement)
                }
            })
        }

        return this.watch(signalRef, (root, items) => {
            update(root, items)
        })
    }
}

const KohBase = KohComponent

customElements.define('koh-component', KohBase)

export const koh = kohCb => {
    return (props = {}, children = []) => {
        const koh = new KohBase()
        const component = koh.init(kohCb, props, children)
        return root => {
            root?.appendChild(component)
        }
    }
}

export const mount = (selector, kohComponent) => {
    const mountPoint = document.getElementById(selector)
    kohComponent(mountPoint)
}

export const parseModule = (selector, moduleName) => {
    const scripts = document.querySelectorAll('script[type="text/x-magento-init"]')
    for (const script of scripts) {
        try {
            const json = JSON.parse(script.textContent)
            if (json[selector] && json[selector][moduleName]) {
                return json[selector][moduleName]
            }
        } catch (e) {}
    }
    return null
}
