1. npm i styled-components -> 스타일드컴포넌트 설치
2. npx creat-react-app my-app --tamplate typescript -> 이렇게 타입스크립트 리액트앱을 생성할 수 있다.
3. npm install --save typescript @types/node @types/react @types/react-dom @types/jest -> 기존 리액트앱에 타입스크립트 설치
4. tsconfig.json 생성
5. npm i react-router-dom@5.3.0
6. npm i react-query
7. npm install --save react-apexcharts apexcharts -> apex차트 `https://apexcharts.com/`
8. npm i react-helmet -> html의 head를 변경하는 컴포넌트
9. npm i recoil -> state management, Redux와 비슷함
10. npm i react-hook-form -> form태그와 그에 필요한 state값을 쉽게 사용하는 라이브러리 `https://react-hook-form.com/kr/api/`
11. npm i react-beautiful-dnd -> 드래그 앤 드롭 라이브러리
12. npm i framer-motion -> 애니매이션 컴포넌트 설치, react-script버전이 5버전보다 낮으면 CRACO를 사용해서 구성요소를 덮어써야한다. `https://www.framer.com/docs/transition`

Prop-Types = 코드 실행뒤에 컴포넌트 prop에 문제가 있다고 알려줌
typescript = 코드 실행전에 문제가 있다고 알려줌

SyntheticEvent (합성 이벤트) = ReactJs 버전의 이벤트 != 자바스크립트 이벤트
이벤트 핸들러는 모든 브라우저에서 이벤트를 동일하게 처리하기 위한 이벤트 래퍼 SyntheticEvent 객체를 전달받습니다.
`https://reactjs.org/docs/events.html`

typescript를 사용해서 코딩중에 어떤 라이브러리를 다운받아 사용한다면 그 라이브러리를 typescript에게 설명해줘야 한다. 그 기능을 @types/(라이브러리이름) 로 다운받아 대신 설명 해주는 것이다.
