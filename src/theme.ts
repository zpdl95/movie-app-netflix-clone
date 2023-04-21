import { DefaultTheme } from "styled-components";

/* DefaultTheme이라고 type을 정해줌으로써 내부의 변수들을 자동완성 시켜줄 수 있다 */
export const theme: DefaultTheme = {
  red: "#E51013",
  black: {
    veryDark: "#141414",
    darker: "#181818",
    lighter: "#2F2F2F",
  },
  white: {
    lighter: "#fff",
    darker: "#e5e5e5",
  },
};
