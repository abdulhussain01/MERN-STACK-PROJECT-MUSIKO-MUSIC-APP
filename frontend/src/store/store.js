import {configureStore} from "@reduxjs/toolkit"
import themeReducer from "./slices/theme.slice"
import playerReducer from "./slices/player.slice"
import userReducer from "./slices/user.slice"
const store = configureStore({
    reducer:{
        user:userReducer,
        theme:themeReducer,
        player:playerReducer,
    }
})

export default store