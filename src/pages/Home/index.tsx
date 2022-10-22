// Controlled manter em tempo real a informação que o usuario insere em um estado. Usa-se em telas simples e pqeuenas. Basicamente é passar funções de setas no proprio elemento.
// Uncrotolled busca a informação apenas quando precisar dela. Basicamente é passar funções para fazer algo sempre quando o elemento é chamado.
import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StopCountdownButton,
  StartCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCyclesForm'
import { CountDown } from './components/CountDown'
import { useContext } from 'react'
import * as zod from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CyclesContext } from '../../context/CyclesContext'

// Interface é quando vai definir o objeto de validação
//   interface NewCycleFormData {
//     task: string
//     minutesAmount: number
//   }

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

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  // Register adiciona um input ao formulário, fala quais os campos dos formulario. é uma função e rotorna os metodos de um input
  // Watch vai observar o valor de task, para saber o seu valor
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormvalidationSchema),
    // O segundo valor é de que forma eu quero validar o formulário
    // DefaultValues passa o valor inicial que queremos
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        {/* Contexto do próprio React Hooks Forms */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="submit">
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
