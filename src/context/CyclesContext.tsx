import { differenceInSeconds } from 'date-fns'
import { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import { ActionTypes, addNewCycleAction, interruptedCurrentCycleAction, markCurrentCycleFinishedAction} from '../reducers/cycles/actions'
import {  Cycle, cyclesReducer } from '../reducers/cycles/reducer'



interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinish: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}



export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {

  //Usamos o educer quando precisamos de um estado que mantem muitos dados e é alterado de muitas fontes diferentes
  const [cyclesState, dispatch] = useReducer(cyclesReducer , 
    /*Agora receb o valor inical*/ {
    cycles: [],
    activeCycleId: null,
}, () => {
  const storedStateAsJson = localStorage.getItem('@ignite-Timer:cycles-state-1.0.0');
  if(storedStateAsJson){
    return JSON.parse(storedStateAsJson)
  }
  return {cycles: [], activeCycleId: null};
})

   useEffect(() => {
    const stateJson = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-Timer:cycles-state-1.0.0', stateJson)
  }, [cyclesState])

  const {cycles, activeCycleId} = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(()=>{
    if(activeCycle){
      return differenceInSeconds( new Date(), new Date(activeCycle.startData),
      )
    }

    return 0
  })
  
  

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinish() {
    dispatch(markCurrentCycleFinishedAction())
  }

  // data são os dados vindo do input do formulário
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startData: new Date(),
    }
    // Sempre quando for alterar um estado e esse estado depende de seu valor anterior, é interessante setar esse valor como Função
    // setCycles((state) => [...state, newCycle])
    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
    // O reset é uma função que reseta os valores para o seu valor inicial. obs: o Valor inicial é o passado em (defaultValues) no metodo useForm
    // reset()
  }

  function interruptCurrentCycle() {
    dispatch(interruptedCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinish,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}