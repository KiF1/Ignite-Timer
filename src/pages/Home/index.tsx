// Controlled manter em tempo real a informação que o usuario insere em um estado. Usa-se em telas simples e pqeuenas. Basicamente é passar funções de setas no proprio elemento.
// Uncrotolled busca a informação apenas quando precisar dela. Basicamente é passar funções para fazer algo sempre quando o elemento é chamado.
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import {
  HomeContainer,
  CountDownContainer,
  FormContainer,
  Separator,
  TaskInput,
  MinutesInput,
  StopCountdownButton,
  StartCountdownButton,
} from './styles'

// Formato em que eu quero que o formulário seja validado. O (.object()) é passado orque os dados vindos do data são um objeto
const newCycleFormvalidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a Tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O minimo é 1 minutos')
    .max(60, 'O maximo de tempo é 60 minutos'),
})

// Type é quando vai criar uma tipagem que já vem de outra tipagem ou variavel. E sempre passa o typeof antes dessa variavel
type NewCycleFormData = zod.infer<typeof newCycleFormvalidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startData: Date
  interruptDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startData,
        )
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    // Sempre que muda o temo, o temo anterior ainda continua, o UseEffect não limpa o anterior, sendo necessário passar a função abaixo:
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  // Interface é quando vai definir o objeto de validação
  //   interface NewCycleFormData {
  //     task: string
  //     minutesAmount: number
  //   }

  // Register adiciona um input ao formulário, fala quais os campos dos formulario. é uma função e rotorna os metodos de um input
  // Watch vai observar o valor de task, para saber o seu valor
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormvalidationSchema),
    // O segundo valor é de que forma eu quero validar o formulário
    // DefaultValues passa o valor inicial que queremos
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  // data são os dados vindo do input do formulário
  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startData: new Date(),
    }
    // Sempre quando for alterar um estado e esse estado depende de seu valor anterior, é interessante setar esse valor como Função
    setCycles((state) => [...state, newCycle])

    setAmountSecondsPassed(0)

    setActiveCycleId(id)
    // O reset é uma função que reseta os valores para o seu valor inicial. obs: o Valor inicial é o passado em (defaultValues) no metodo useForm
    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            placeholder="Dê um nome para o seu projeto"
            id="task"
            type="text"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register('task')}
            // O (...) está pegando todos os metódos que a função register possui
          />
          <datalist id="task-suggestions">
            <option value="projeto 1" />
          </datalist>
          <label htmlFor="">Durante</label>
          <MinutesInput
            placeholder="00"
            type="number"
            disabled={!!activeCycle}
            min={1}
            max={60}
            id="minutesAmount"
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="submit">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
