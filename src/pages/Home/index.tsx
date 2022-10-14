// Controlled manter em tempo real a informação que o usuario insere em um estado. Usa-se em telas simples e pqeuenas. Basicamente é passar funções de setas no proprio elemento.
// Uncrotolled busca a informação apenas quando precisar dela. Basicamente é passar funções para fazer algo sempre quando o elemento é chamado.
import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  CountDownContainer,
  FormContainer,
  Separator,
  Start,
  TaskInput,
  MinutesInput,
} from './styles'
export function Home() {
  // Register adiciona um input ao formulário, fala quais os campos dos formulario. é uma função e rotorna os metodos de um input
  // Watch vai observar o valor de task, para saber o seu valor

  // Formato em que eu quero que o formulário seja validado. O (.object()) é passado orque os dados vindos do data são um objeto
  const newCycleFormvalidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a Tarefa'),
    minutesAmount: zod
      .number()
      .min(5, 'O minimo é 5 minutos')
      .max(60, 'O maximo de tempo é 60 minutos'),
  })

  // Interface é quando vai definir o objeto de validação
  //   interface NewCycleFormData {
  //     task: string
  //     minutesAmount: number
  //   }

  // Type é quando vai criar uma tipagem que já vem de outra tipagem ou variavel. E sempre passa o typeof antes dessa variavel
  type NewCycleFormData = zod.infer<typeof newCycleFormvalidationSchema>

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
    console.log(data)
    // O reset é uma função que reseta os valores para o seu valor inicial. obs: o Valor inicial é o passado em (defaultValues) no metodo useForm
    reset()
  }

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
            min={5}
            max={60}
            id="minutesAmount"
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <Start disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </Start>
      </form>
    </HomeContainer>
  )
}
