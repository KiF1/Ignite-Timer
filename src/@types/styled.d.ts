// APENAS CODIGOS DE DEFINIÇÃO DO TS
// No button.styles.ts agente criou uma tipagem onde a ide vai ler e entender quais sãi as opções disoniveis no defaultTHEME;
import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// Guardando os valores do defaultTheme em um variavel
type ThemeType = typeof defaultTheme

// Criando uma tipagem do styled-components. Como já foi importado o styled-comonents, só vai adicionar uma nova tipagem
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
