import { koh } from '../src/koh'

export const kohButton = koh((k, { loading, label, onClick }, children) => {
    k.html(
        k.dom.button(
            label,
            el => {
                el.className = 'btn-primary'
                el.onclick = onClick
                k.watch(loading, isLoading => {
                    el.disabled = isLoading
                })
            },
            ...children
        )
    )
})
