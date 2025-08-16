
const createNetClipsSlice = (set) => ({
    netClips: [],
    setNetClips: (newClips) =>
        set((state) => ({ netClips: [...state.netClips, ...newClips] })),
})

export default createNetClipsSlice;