import {
  motion,
  useAnimation,
  useViewportScroll,
  Variants,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  color: white;
  padding: 1.5em 5em;
  z-index: 5;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 3em;
  width: 7em;
  height: 1.5em;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 0.05em;
    stroke: white;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 1em;
  color: ${(props) => props.theme.white.darker};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.3s ease-in-out;
  user-select: none;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Search = styled(motion.form)`
  position: relative;
  display: flex;
  align-items: center;
  color: white;
  svg {
    height: 1.5em;
    margin-right: 0.5em;
  }
`;

const Input = styled(motion.input)`
  /* transform-origin = 애니메이션의 시작지점 설정 */
  transform-origin: right center;
  position: absolute;
  right: 35px;
  color: white;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  padding: 0.3em 0.5em;
  padding-left: 2.5em;
  z-index: -1;
  font-size: 1em;
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 0.3em;
  height: 0.3em;
  border-radius: 50%;
  bottom: -0.3em;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const logoVariants: Variants = {
  active: {
    /* []형식으로 사용하면 단계별로 진행시킬 수 있음 */
    fillOpacity: [1, 0, 1],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants: Variants = {
  top: { backgroundColor: 'rgba(0,0,0,.0)' },
  scroll: { backgroundColor: 'rgba(0,0,0,1)' },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useRouteMatch('/');
  const tvMatch = useRouteMatch('/tvs');
  /* useAnimation = 이 훅을 사용해 애니메이션을 코드로 제어 가능 */
  const inputAnimaiton = useAnimation();
  const navAnimation = useAnimation();
  /* useViewportScroll = 스크롤의 모션을 감지해 좌표값 or 진행도를 알려줌 */
  /* scrollY이 값은 변해도 rerendering하지 않음 */
  const { scrollY } = useViewportScroll();
  const scrollRef = useRef(0);
  const { register, handleSubmit, setValue, setFocus } = useForm<IForm>();
  const history = useHistory();

  const toggleSearsh = () => {
    if (searchOpen) {
      /* 해당 조건일때 ↓의 애니메이션 실행 */
      /* 함수를 사용해서 애니메이션을 실행하는 방법 */
      inputAnimaiton.start({ scaleX: 0 });
    } else {
      inputAnimaiton.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  const onValid = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
    setValue('keyword', '');
    toggleSearsh();
  };

  const handleScroll = () => {
    scrollRef.current = document.body.scrollTop;

    if (scrollRef.current > 30) {
      navAnimation.start('scroll');
    } else {
      navAnimation.start('top');
    }
  };

  useEffect(() => {
    document.body.addEventListener('scroll', handleScroll);
    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   /* scrollY.onChange() 이것을 사용하지 않으면 변화를 감지할 수 없음 */
  //   scrollY.onChange(() => {
  //     if (scrollY.get() > 30) {
  //       navAnimation.start('scroll');
  //     } else {
  //       navAnimation.start('top');
  //     }
  //   });
  // }, [scrollY, navAnimation]);

  return (
    <Nav variants={navVariants} initial={'top'} animate={navAnimation}>
      <Col>
        <Logo variants={logoVariants} whileHover='active' viewBox='0 0 111 30'>
          <motion.path
            d='M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z'
            id='Fill-14'
          ></motion.path>
        </Logo>
        <Items>
          <Item>
            <Link to='/'>Home {homeMatch?.isExact && <Circle />}</Link>
          </Item>
          <Item>
            <Link to='/tvs'>Tv Shows {tvMatch && <Circle />}</Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={() => {
              toggleSearsh();
              setFocus('keyword');
            }}
            style={{ cursor: 'pointer' }}
            animate={{ translateX: searchOpen ? -240 : 0 }}
            transition={{ type: 'tween' }}
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clipRule='evenodd'
            ></path>
          </motion.svg>
          <Input
            {...register('keyword', { required: true, minLength: 2 })}
            initial={{ scaleX: 0 }}
            animate={inputAnimaiton}
            transition={{ type: 'tween' }}
            placeholder='Search for the movie or tv show...'
          />
        </Search>
      </Col>
    </Nav>
  );
}
export default Header;
