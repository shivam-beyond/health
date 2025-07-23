import Header from "./components/Header"
import Footer from "./components/Footer"
import Survey from "./components/Survey"
import { createContext, useReducer } from "react"
import appReducer from "./reducers/appReducer"
import { initialState } from "./assets/constants"

export const AppContext = createContext()


function App() {

  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div id="app">
        <Header />
        <main>
          <Survey />
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  )
}

export default App
