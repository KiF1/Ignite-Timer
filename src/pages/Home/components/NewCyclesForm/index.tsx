import { FormContainer, TaskInput, MinutesInput } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../../../context/CyclesContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
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
  )
}
