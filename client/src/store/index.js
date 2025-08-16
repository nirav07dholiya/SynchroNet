import { create } from "zustand";
import createAuthSlice from "./slices/auth-slice";
import createPostSlice from "./slices/post-slice";
import createOpenIdSlice from "./slices/open-id-slice";
import createSavedSlice from "./slices/saved-slice";
import createDarkModeSlice from "./slices/darkmode-slice";
import createNetClipsSlice from "./slices/netclips-slice";

const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createPostSlice(...a),
    ...createOpenIdSlice(...a),
    ...createSavedSlice(...a),
    ...createDarkModeSlice(...a),
    ...createNetClipsSlice(...a),
}))

export default useAppStore;