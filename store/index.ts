export interface RootState {
    counter: number
}

export const state = (): RootState => ({
    counter: 0,
})

export const mutations = {
    increment(state: RootState) {
        state.counter++
    },
}
