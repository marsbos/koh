const makeSignal = data => {
    if (data !== null && typeof data === 'object' && !data._isKohSignal) {
        // Make reactive if array or object:
        for (const key in data) {
            if (data[key] && !data[key]._isKohSignal) {
                data[key] = kohSignal(data[key])
            }
        }
    }
    return data
}

export const kohSignal = state => {
    let internalValue = makeSignal(state)
    const subscribers = new Set()
    let hasPendingUpdates = false

    const queue = new Set()

    const processQueue = () => {
        queue.forEach(fn => fn())
        queue.clear()
        hasPendingUpdates = false
    }

    const signalProxy = function (value) {
        if (arguments.length > 0) {
            // Setter
            let newValue = value
            if (typeof value === 'function') {
                newValue = value(internalValue)
            }
            if (!Object.is(newValue, internalValue)) {
                // Create signal for nested properties (array or object)
                internalValue = makeSignal(newValue)

                subscribers.forEach(fn => {
                    queue.add(fn)
                    if (!hasPendingUpdates) {
                        hasPendingUpdates = true
                        queueMicrotask(processQueue)
                    }
                })
            }
        } else {
            // Getter
            if (kohSignal._currentSubscriber) {
                subscribers.add(kohSignal._currentSubscriber)
            }
            return internalValue
        }
    }
    signalProxy._isKohSignal = true
    signalProxy.unsubscribe = fn => {
        subscribers.delete(fn)
    }

    return new Proxy(signalProxy, {
        get(target, prop, _) {
            if (prop === '_isKohSignal') return true
            if (prop === 'unsubscribe') return target[prop]

            // 1. Get value from internalValue (array or object)
            const value = internalValue && internalValue[prop]

            // 2. IMPORTANT: Only add subscribers if we actually read data
            // Ignore Symbols and .length prop for dep tracking.
            if (kohSignal._currentSubscriber && typeof prop !== 'symbol' && prop !== 'length') {
                subscribers.add(kohSignal._currentSubscriber)
            }

            // 3. Return the Signal ref
            if (value != null) return value

            // 4. Otherwise, return prototype props (like .push, .map)
            return target[prop]
        },
    })
}
kohSignal._currentSubscriber = undefined
