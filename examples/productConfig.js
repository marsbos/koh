import { koh } from '../src/koh'
import { kohButton } from './button'

export const productConfig = koh((k, props) => {
    const products = k.state(props.products)
    const product = k.state({
        name: 'Shiftback jeans',
        price: 129.99,
        colors: ['Gray', 'Blue', 'Brown'],
    })
    const cart = k.state({
        items: [
            { name: 'Pants', price: 288, amount: 2 },
            { name: 'Koh shirt', price: 49.99, amount: 3 },
            { name: 'Jeans', price: 124.5, amount: 2 },
        ],
        total: 0,
    })
    const loading = k.state(false)

    const cartTotals = k.compute(() => {
        return cart.items().reduce((prev, curr) => prev + curr?.price() * curr?.amount(), 0)
    })

    const text = (signalRef, cb) => {
        return k.watch(signalRef, (el, value) => {
            el.textContent = cb(value)
        })
    }

    k.html(
        k.dom.h1(text(cartTotals, value => `Totals: ${value}`)),
        k.dom.div(
            el => {
                el.className = 'flex '
            },
            k.dom.button('add item', el => {
                el.onclick = () => {
                    cart.items(prev => [...prev, { name: 'Cart item', price: 49.99, amount: 1 }])
                }
            }),
            k.dom.button('sort price', el => {
                el.onclick = () => {
                    cart.items(prev => [...prev.sort((a, b) => a.price() - b.price())])
                }
            }),
            k.dom.button('sort name', el => {
                el.onclick = () => {
                    cart.items(prev => [...prev.sort((a, b) => (a.name() < b.name() ? -1 : 1))])
                }
            })
        )
    )

    k.html(
        k.dom.ul(
            k.for(cart.items, (item, idx) => {
                return k.dom.li(
                    el => {
                        el.onclick = () => console.log(item.price())
                    },
                    k.dom.span(
                        k.watch(item.name, (el, name) => {
                            el.textContent = `${name}`
                        })
                    ),

                    k.dom.span(
                        k.watch(item.price, (el, newPrice) => {
                            el.textContent = `${idx}: €${newPrice}`
                        })
                    ),
                    kohButton(
                        {
                            loading,
                            label: 'Remove',
                            onClick: () => {
                                loading(true)
                                cart.items(prev => prev.filter(itm => itm !== item))
                                setTimeout(() => {
                                    loading(false)
                                }, 1000)
                            },
                        },
                        [k.dom.b('chill')]
                    )
                )
            })
        )
    )
})
